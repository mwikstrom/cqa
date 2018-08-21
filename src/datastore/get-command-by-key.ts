import { PositiveInteger } from "../common-types/positive-integer";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";
import { makeStoredCommand } from "./make-stored-command";
import { IStoredCommand } from "./stored-command";

/** @internal */
export function getCommandByKey(
    context: DatastoreContext,
    key: number,
): Promise<IStoredCommand | null> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const {
        db,
    } = context;

    if (!PositiveInteger.is(key)) {
        return Promise.resolve(null);
    }

    return db.transaction(
        "r",
        db.commands,
        async () => makeStoredCommand(key, await db.commands.get(key)),
    );
}
