import { ICommandInput, IStoredCommand } from "../../public/datastore/typings";
import { verify } from "../verify";
import { CommandInputType } from "./command-input";
import { DB, ICommandTableValue } from "./db";

export async function addCommand(
    db: DB,
    input: ICommandInput,
): Promise<IStoredCommand> {
    verify("command input", input, CommandInputType);

    const {
        payload,
        target,
        timestamp = new Date().getTime(),
        type,
    } = input;

    // TODO: Assign global id too

    const value: ICommandTableValue = {
        payload,
        target,
        timestamp,
        type,
    };

    // TODO: Store encrypted data instead
    const key = await db.transaction(
        "rw",
        db.commands,
        () => db.commands.add(value),
    );

    const result: IStoredCommand = {
        key,
        payload,
        target,
        timestamp,
        type,
    };

    return result;
}
