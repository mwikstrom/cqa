import * as t from "io-ts";
import { IStoredCommand } from "../../public/datastore/typings";
import { verify } from "../verify";
import { DB, ICommandTableValue } from "./db";

export function getCommandByKey(
    db: DB,
    key: number,
): Promise<IStoredCommand | null> {
    verify("command key", key, t.number);

    return db.transaction(
        "r",
        db.commands,
        async () => makeStoredCommand(key, await db.commands.get(key)),
    );
}

export function getCommandById(
    db: DB,
    id: string,
): Promise<IStoredCommand | null> {
    verify("command id", id, t.string);

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const key = (await db.commands.where("id").equals(id).limit(1).primaryKeys())[0];

            if (!key) {
                return null;
            }

            return makeStoredCommand(key, await db.commands.get(key));
        },
    );
}

function makeStoredCommand(
    key: number,
    value: ICommandTableValue | undefined,
): IStoredCommand | null {
    if (!value) {
        return null;
    }

    const {
        id,
        payload,
        target,
        timestamp,
        type,
    } = value;

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
