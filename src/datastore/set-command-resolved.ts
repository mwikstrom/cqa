import { PositiveInteger } from "../common-types/positive-integer";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { CommandRecordType } from "./command-record-type";
import { DatastoreContext } from "./datastore-context";

/** @internal */
export function setCommandResolved(
    context: DatastoreContext,
    key: number,
    commit: string,
): Promise<boolean> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(PositiveInteger.is(key));
        assert(typeof commit === "string");
    }

    const { db, now } = context;

    return db.transaction(
        "rw",
        db.commands,
        async () => {
            const record = await db.commands.get(key);

            if (!record) {
                throw new Error(`Unknown command ${key} cannot be ${commit ? "accepted" : "rejected"}`);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(CommandRecordType.is(record));
                assert(record.resolved || !record.commit);
            }

            if (!record.resolved) {
                record.resolved = true;
                record.commit = commit;
                record.timestamp = now();
                await db.commands.put(record);
                return true;
            } else if (record.commit !== commit) {
                throw new Error(
                    record.commit ?
                    commit ?
                    `Command ${key} is already accepted in another commit` :
                    `Command ${key} is accepted and cannot be rejected` :
                    `Command ${key} is rejected and cannot be accepted`,
                );
            } else {
                return false;
            }
        },
    );
}
