import { IJsonObject } from "../api/json-value";
import { IPurgeOptions } from "../api/purge-options";
import { computeJsonHash } from "../json/compute-json-hash";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { uint8ArrayToBase64Url } from "../utils/uint8-array-to-base64-url";
import { DatastoreContext } from "./datastore-context";

/** @internal */
export async function purge(
    context: DatastoreContext,
    options: IPurgeOptions = {},
): Promise<void> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const {
        db,
        now,
    } = context;

    const {
        activeQueries = [],
        commandRetentionPeriod = 5 * 60 * 1000, // default is five minutes
        queryRetentionPeriod = 60 * 60 * 1000, // default is one hour
    } = options;

    const currentTime = now().getTime();
    const keepCommandsAfter = new Date(currentTime - commandRetentionPeriod);
    const keepQueriesAfter = new Date(currentTime - queryRetentionPeriod);
    const activeQueryKeys = new Set(await Promise.all(activeQueries.map(
        async query => encodeKey(await computeJsonHash(query as any as IJsonObject)))));

    await db.transaction(
        "rw",
        db.commands,
        db.queries,
        db.results,
        async () => {
            // Delete queries with a timestamp older than the specified retention period,
            // but keep those that listed as "active".
            const oldQueryKeys = await db.queries.where("timestamp").below(keepQueriesAfter).primaryKeys();
            const queryKeysToDrop = oldQueryKeys.filter(key => !activeQueryKeys.has(encodeKey(key)));
            await Promise.all([
                db.queries.bulkDelete(queryKeysToDrop),
                db.results.bulkDelete(queryKeysToDrop),
            ]);

            // Delete commands with a timestamp older than the specified retention period,
            // but keep all pending commands and all accepted commands with a commit
            // version higher than the commit of the most out of sync query.
            const mostOutOfSyncQuery = await db.queries.orderBy("commit").first();
            const mostOutOfSyncCommit = mostOutOfSyncQuery ? mostOutOfSyncQuery.commit : "";
            const oldCommands = await db.commands.where("timestamp").below(keepCommandsAfter).toArray();
            const commandKeysToDrop = oldCommands.filter(cmd =>
                cmd.resolved === true && // never drop pending commands
                cmd.commit <= mostOutOfSyncCommit, // keep accepted commands with an unsynced commit
            ).map(cmd => cmd.key);
            await db.commands.bulkDelete(commandKeysToDrop);
        },
    );
}

function encodeKey(
    key: ArrayBuffer,
): string {
    return uint8ArrayToBase64Url(new Uint8Array(key));
}
