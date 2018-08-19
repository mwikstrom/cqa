import { ICommandInput, IStoredCommand } from "../../public/datastore/typings";
import { assert } from "../assert";
import { PositiveIntegerType } from "../common-runtime-types";
import { DEBUG } from "../env";
import { createIdentifier } from "../id";
import { verify } from "../verify";
import { Context } from "./context";
import { ICommandTableValue } from "./db";
import { CommandInputType, CommandTableValueType, StoredCommandType } from "./runtime-types";

export async function addCommand(
    context: Context,
    input: ICommandInput,
): Promise<IStoredCommand> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof Context);
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
        assert(PositiveIntegerType.is(key));
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
