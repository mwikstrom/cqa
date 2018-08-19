import * as t from "io-ts";
import { IStoredCommand } from "../../public/datastore/typings";
import { assert } from "../assert";
import { PositiveIntegerType } from "../common-runtime-types";
import { DEBUG } from "../env";
import { Context } from "./context";
import { ICommandTableValue } from "./db";
import { CommandTableValueType, StoredCommandType } from "./runtime-types";

export function getCommandByKey(
    context: Context,
    key: number,
): Promise<IStoredCommand | null> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof Context);
    }

    const {
        db,
    } = context;

    if (!PositiveIntegerType.is(key)) {
        return Promise.resolve(null);
    }

    return db.transaction(
        "r",
        db.commands,
        async () => makeStoredCommand(key, await db.commands.get(key)),
    );
}

export function getCommandById(
    context: Context,
    id: string,
): Promise<IStoredCommand | null> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof Context);
    }

    const {
        db,
    } = context;

    if (!t.string.is(id)) {
        return Promise.resolve(null);
    }

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
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(value === undefined || CommandTableValueType.is(value));
    }

    if (value === undefined) {
        return null;
    }

    const {
        commit,
        id,
        payload,
        status,
        target,
        timestamp,
        type,
    } = value;

    const result: IStoredCommand = {
        commit,
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
