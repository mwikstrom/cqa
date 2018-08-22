import { PositiveInteger } from "../common-types/positive-integer";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { CommandTableValueType } from "./command-table-value";
import { DatastoreContext } from "./datastore-context";
import { makeStoredCommand } from "./make-stored-command";
import { IPendingCommandOptions } from "./pending-command-options";
import { IStoredCommand } from "./stored-command";

/** @internal */
export function getPendingCommands(
    context: DatastoreContext,
    options: IPendingCommandOptions = {},
): Promise<IStoredCommand[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db } = context;
    const {
        maxTargets = Infinity,
        skipTarget = () => false,
    } = options;

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const map = new Map<string, IStoredCommand>();

            await db.commands.where("status").equals("pending").until(
                () => map.size >= maxTargets,
            ).each((value, { primaryKey }) => {
                // istanbul ignore else: debug assertion
                if (DEBUG) {
                    assert(PositiveInteger.is(primaryKey));
                    assert(CommandTableValueType.is(value));
                    assert(value.status === "pending");

                    const prev = map.get(value.target);
                    assert(!prev || prev.key < primaryKey);
                }

                if (skipTarget(value.target) !== true && !map.has(value.target)) {
                    const command = makeStoredCommand(primaryKey, value);

                    // istanbul ignore else: debug assertion
                    if (DEBUG) {
                        assert(command !== null);
                    }

                    map.set(value.target, command!);
                }
            });

            return Array.from(map.values());
        },
    );
}
