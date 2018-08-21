import { assert } from "./assert";
import { CommandTableValueType } from "./command-table-value";
import { DatastoreContext } from "./datastore-context";
import { DEBUG } from "./env";
import { makeStoredCommand } from "./make-stored-command";
import { IPendingCommandOptions, PendingCommandOptionsType } from "./pending-command-options";
import { PositiveInteger } from "./positive-integer";
import { IStoredCommand } from "./stored-command";
import { verify } from "./verify";

/** @internal */
export function getPendingCommands(
    context: DatastoreContext,
    options: IPendingCommandOptions = {},
): Promise<IStoredCommand[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const {
        db,
    } = context;

    verify("pending command options", options, PendingCommandOptionsType);

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
