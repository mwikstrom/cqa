import { ICommandListener } from "../api/command-listener";
import { IJsonCrypto } from "../api/json-crypto";
import { createCommandDataFromRecord } from "./create-command-data-from-record";
import { DatastoreDB } from "./datastore-db";

/** @internal */
export function setupCommandListener(
    db: DatastoreDB,
    crypto: IJsonCrypto,
    on: ICommandListener,
): void {
    db.on("changes", changes => changes.filter(change => change.table === db.commands.name).forEach((change: any) => {
        if (change.type === 1 /* Create */ && typeof on.added === "function") {
            const record = { ...change.obj, key: change.key };
            createCommandDataFromRecord(record, crypto).then(data => on.added!(data));
        } else if (change.type === 3 /* Delete */ && typeof on.purged === "function") {
            on.purged(change.key);
        } else if (change.type === 2 /* Update */ && "resolved" in change.mods) {
            const { commit } = change.mods;
            if (commit && typeof on.accepted === "function") {
                on.accepted(change.key, commit);
            } else if (!commit && typeof on.rejected === "function") {
                on.rejected(change.key);
            }
        }
    }));
}
