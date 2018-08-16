import { ICommandInput, IStoredCommand } from "../../public/datastore/typings";
import { createIdentifier } from "../id";
import { verify } from "../verify";
import { CommandInputType } from "./command-input";
import { DB, ICommandTableValue } from "./db";

export async function addCommand(
    db: DB,
    input: ICommandInput,
): Promise<IStoredCommand> {
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

    // TODO: Store encrypted data instead
    const key = await db.transaction(
        "rw",
        db.commands,
        async () => await db.commands.add(value),
    );

    const result: IStoredCommand = {
        id,
        key,
        payload,
        target,
        timestamp,
        type,
    };

    return result;
}
