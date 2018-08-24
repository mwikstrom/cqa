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

    const { db } = context;

    return db.transaction(
        "rw",
        db.commands,
        async () => {
            const record = await db.commands.get(key);

            if (!record) {
                throw new Error(`Cannot mark non-existing command ${key} as ${commit ? "accepted" : "rejected"}`);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(CommandRecordType.is(record));
                assert(record.resolved || !record.commit);
            }

            const changed = !record.resolved;
            if (changed) {
                record.resolved = true;
                record.commit = commit;
            } else if (record.commit !== commit) {
                throw new Error(
                    record.commit ?
                    commit ?
                    `Command ${key} is already marked as accepted in another commit` :
                    `Command ${key} is already marked as accepted and cannot be rejected` :
                    `Command ${key} is already marked as rejected and cannot be accepted`,
                );
            }

            return changed;
        },
    );
}
