import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";
import { makeStoredCommand } from "./make-stored-command";
import { resolveCommandKey } from "./resolve-command-key";
import { IStoredCommand } from "./stored-command";

/** @internal */
export function getCommand(
    context: DatastoreContext,
    keyOrId: number | string,
): Promise<IStoredCommand | null> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db } = context;

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const key = await resolveCommandKey(context, keyOrId);
            return makeStoredCommand(key, await db.commands.get(key));
        },
    );
}
