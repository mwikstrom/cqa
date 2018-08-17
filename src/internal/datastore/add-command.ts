import { ICommandInput, IStoredCommand } from "../../public/datastore/typings";
import { assert } from "../assert";
import { PositiveIntegerType } from "../common-runtime-types";
import { DEBUG } from "../env";
import { createIdentifier } from "../id";
import { verify } from "../verify";
import { Context } from "./context";
import { ICommandTableValue } from "./db";
import { CommandInputType, StoredCommandType } from "./runtime-types";

export async function addCommand(
    context: Context,
    input: ICommandInput,
): Promise<IStoredCommand> {
    // istanbul ignore else
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

    const value: ICommandTableValue = {
        id,
        payload,
        target,
        timestamp,
        type,
    };

    // TODO: debug assert pending command table value

    // TODO: Store encrypted data instead
    const key = await db.transaction(
        "rw",
        db.commands,
        async () => await db.commands.add(value),
    );

    // istanbul ignore else
    if (DEBUG) {
        assert(PositiveIntegerType.is(key));
    }

    const result: IStoredCommand = {
        id,
        key,
        payload,
        target,
        timestamp,
        type,
    };

    // istanbul ignore else
    if (DEBUG) {
        assert(StoredCommandType.is(result));
    }

    return result;
}
