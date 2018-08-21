import { assert } from "./assert";
import { CommandInputType, ICommandInput } from "./command-input";
import { CommandTableValueType, ICommandTableValue } from "./command-table-value";
import { createIdentifier } from "./create-identifier";
import { DatastoreContext } from "./datastore-context";
import { DEBUG } from "./env";
import { PositiveInteger } from "./positive-integer";
import { IStoredCommand, StoredCommandType } from "./stored-command";
import { verify } from "./verify";

/** @internal */
export async function addCommand(
    context: DatastoreContext,
    input: ICommandInput,
): Promise<IStoredCommand> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const {
        db,
    } = context;

    verify("command input", input, CommandInputType);

    const {
        id = createIdentifier(),
        payload,
        target,
        timestamp = new Date().getTime(),
        type,
    } = input;

    const status = "pending";

    const value: ICommandTableValue = {
        id,
        payload,
        status,
        target,
        timestamp,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(CommandTableValueType.is(value));
    }

    // TODO: Store encrypted data instead
    const key = await db.transaction(
        "rw",
        db.commands,
        async () => await db.commands.add(value),
    );

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(PositiveInteger.is(key));
    }

    const result: IStoredCommand = {
        id,
        key,
        payload,
        status,
        target,
        timestamp,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(StoredCommandType.is(result));
    }

    return result;
}
