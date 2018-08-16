import { ICommandInput, IStoredCommand } from "../../public/datastore/typings";
import { assert } from "../assert";
import { DEBUG } from "../env";
import { createIdentifier } from "../id";
import { verify } from "../verify";
import { CommandInputType } from "./command-input";
import { Context } from "./context";
import { ICommandTableValue } from "./db";

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
        // TODO: Use key rtt instead
        assert(key > 0);
    }

    const result: IStoredCommand = {
        id,
        key,
        payload,
        target,
        timestamp,
        type,
    };

    // TODO: debug assert pending stored command

    return result;
}
