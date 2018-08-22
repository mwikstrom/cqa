import { NonEmptyString } from "../common-types/non-empty-string";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { IActiveCommandOptions } from "./active-command-options";
import { DatastoreContext } from "./datastore-context";
import { makeStoredCommand } from "./make-stored-command";
import { IStoredCommand } from "./stored-command";

/** @internal */
export function getActiveCommands(
    context: DatastoreContext,
    options: IActiveCommandOptions = {},
): Promise<IStoredCommand[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db } = context;
    const { after } = options;

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const result = new Array<IStoredCommand>();

            if (NonEmptyString.is(after)) {
                await db.commands.where("commit").above(after).each((value, { primaryKey }) => {
                    const command = makeStoredCommand(primaryKey, value);

                    // istanbul ignore else: debug assertion
                    if (DEBUG) {
                        assert(command !== null);
                        assert(value.status === "accepted");
                        assert(typeof value.commit === "string" && value.commit > after);
                    }

                    result.push(command!);
                });
            }

            await db.commands.where("status").equals("pending").each((value, { primaryKey }) => {
                const command = makeStoredCommand(primaryKey, value);

                // istanbul ignore else: debug assertion
                if (DEBUG) {
                    assert(command !== null);
                    assert(value.status === "pending");
                }

                result.push(command!);
            });

            return result;
        },
    );
}
