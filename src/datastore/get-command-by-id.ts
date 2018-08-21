import { NonEmptyString } from "../common-types/non-empty-string";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";
import { makeStoredCommand } from "./make-stored-command";
import { IStoredCommand } from "./stored-command";

/** @internal */
export function getCommandById(
    context: DatastoreContext,
    id: string,
): Promise<IStoredCommand | null> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const {
        db,
    } = context;

    if (!NonEmptyString.is(id)) {
        return Promise.resolve(null);
    }

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const key = (await db.commands.where("id").equals(id).limit(1).primaryKeys())[0];

            if (!key) {
                return null;
            }

            return makeStoredCommand(key, await db.commands.get(key));
        },
    );
}
