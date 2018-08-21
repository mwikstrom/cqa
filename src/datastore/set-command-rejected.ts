import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { CommandTableValueType } from "./command-table-value";
import { DatastoreContext } from "./datastore-context";
import { resolveCommandKey } from "./resolve-command-key";

export function setCommandRejected(
    context: DatastoreContext,
    keyOrId: number | string,
): Promise<boolean> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db } = context;

    return db.transaction(
        "rw",
        db.commands,
        async () => {
            const key = await resolveCommandKey(context, keyOrId);
            const value = await db.commands.get(key);
            let changed = false;

            if (!value) {
                throw new Error(`Cannot mark non-existing command ${JSON.stringify(keyOrId)} as rejected`);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(CommandTableValueType.is(value));
            }

            if (value.status === "accepted") {
                throw new Error(`Cannot mark accepted command ${JSON.stringify(keyOrId)} as rejected`);
            }

            if (value.status === "pending") {
                value.status = "rejected";
                changed = true;
                await db.commands.put(value, key);
            }

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(value.status === "rejected");
            }

            return changed;
        },
    );
}
