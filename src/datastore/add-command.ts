import { PositiveInteger } from "../common-types/positive-integer";
import { assert } from "../utils/assert";
import { createIdentifier } from "../utils/create-identifier";
import { DEBUG } from "../utils/env";
import { verify } from "../utils/verify";
import { CommandInputType, ICommandInput } from "./command-input";
import { CommandTableValueType, ICommandTableValue } from "./command-table-value";
import { DatastoreContext } from "./datastore-context";
import { IStoredCommand, StoredCommandType } from "./stored-command";

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
        type,
    } = input;

    const status = "pending";

    const value: ICommandTableValue = {
        id,
        payload,
        status,
        target,
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
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(StoredCommandType.is(result));
    }

    return result;
}
