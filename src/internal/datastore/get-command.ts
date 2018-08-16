import * as t from "io-ts";
import { IStoredCommand } from "../../public/datastore/typings";
import { verify } from "../verify";
import { DB, ICommandTableValue } from "./db";

// TODO: ctx instead of db
export function getCommandByKey(
    db: DB,
    key: number,
): Promise<IStoredCommand | null> {
    // TODO: Debug assert ctx/db

    // TODO: Check key against rtt and return null on bad input instead of verify
    verify("command key", key, t.number);

    return db.transaction(
        "r",
        db.commands,
        async () => makeStoredCommand(key, await db.commands.get(key)),
    );
}

// TODO: replace with resolveCommandId
export function getCommandById(
    db: DB,
    id: string,
): Promise<IStoredCommand | null> {
    // TODO: Debug assert ctx/db

    // TODO: Check id against rtt and return null on bad input instead of verify
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
    // TODO: Debug assert command table value or undefined

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

    // TODO: Debug assert stored command

    return result;
}
