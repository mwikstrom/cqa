import { JsonValue } from "..";
import { IQueryDescriptor } from "../api/query-descriptor";
import { IUpdateQueryOptions } from "../api/update-query-options";
import { computeJsonHash } from "../json/compute-json-hash";
import { patchJsonInPlace } from "../json/patch-json-in-place";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";
import { QueryDescriptorType } from "./query-descriptor-type";

/** @internal */
export async function updateQueryResult(
    context: DatastoreContext,
    query: IQueryDescriptor,
    options: IUpdateQueryOptions,
): Promise<void> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(QueryDescriptorType.is(query));
        // TODO: Add assertion for `options`
    }

    const { commitBefore, commitAfter, patch } = options;
    const { db, crypto, now } = context;
    const key = await computeJsonHash(query as any as JsonValue);
    let encryptedDataAfter: ArrayBuffer | undefined;

    if (patch !== undefined) {
        const encryptedDataBefore = await db.results.get(key);

        if (encryptedDataBefore === undefined) {
            throw new Error("Cannot update missing query");
        }

        const dataBefore = await crypto.decrypt(encryptedDataBefore, key);
        const dataAfter = patchJsonInPlace(dataBefore, patch);

        encryptedDataAfter = await crypto.encrypt(dataAfter, key);
    }

    await db.transaction(
        "rw",
        db.queries,
        db.results,
        async () => {
            const record = await db.queries.get(key);

            if (record === undefined) {
                throw new Error("Cannot update missing query");
            }

            if (record.commit !== commitBefore) {
                throw new Error("Commit version conflict");
            }

            record.commit = commitAfter;
            record.timestamp = now();

            const todo: Array<Promise<any>> = [db.queries.put(record)];

            if (encryptedDataAfter !== undefined) {
                todo.push(db.results.put(encryptedDataAfter, key));

            }

            await Promise.all(todo);
        },
    );
}
