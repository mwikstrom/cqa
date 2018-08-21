import { NonEmptyString } from "../common-types/non-empty-string";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { verify } from "../utils/verify";
import { CommandTableValueType } from "./command-table-value";
import { DatastoreContext } from "./datastore-context";
import { resolveCommandKey } from "./resolve-command-key";

export function setCommandAccepted(
    context: DatastoreContext,
    keyOrId: number | string,
    commit: string,
): Promise<boolean> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    verify("commit version", commit, NonEmptyString);

    const { db } = context;

    return db.transaction(
        "rw",
        db.commands,
        async () => {
            const key = await resolveCommandKey(context, keyOrId);
            const value = await db.commands.get(key);
            let changed = false;

            if (!value) {
                throw new Error(`Cannot mark non-existing command ${JSON.stringify(keyOrId)} as accepted`);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(CommandTableValueType.is(value));
            }

            if (value.status === "rejected") {
                throw new Error(`Cannot mark rejected command ${JSON.stringify(keyOrId)} as accepted`);
            }

            if (value.status === "accepted" && value.commit !== commit) {
                throw new Error(
                    `Command ${JSON.stringify(keyOrId)} is already marked as accepted for another commit version`,
                );
            }

            if (value.status === "pending") {
                value.status = "accepted";
                value.commit = commit;
                changed = true;
                await db.commands.put(value, key);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(value.status === "accepted");
                assert(value.commit === commit);
            }

            return changed;
        },
    );
}
