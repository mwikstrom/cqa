import { IPendingCommandOptions, IStoredCommand } from "../../public/datastore/typings";
import { assert } from "../assert";
import { NonEmptyString, PositiveIntegerType } from "../common-runtime-types";
import { DEBUG } from "../env";
import { verify } from "../verify";
import { Context } from "./context";
import { ICommandTableValue } from "./db";
import { CommandTableValueType, PendingCommandOptionsType, StoredCommandType } from "./runtime-types";

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

    if (!NonEmptyString.is(id)) {
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

export function getPendingCommands(
    context: Context,
    options: IPendingCommandOptions = {},
): Promise<IStoredCommand[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof Context);
    }

    const {
        db,
    } = context;

    verify("pending command options", options, PendingCommandOptionsType);

    const {
        maxTargets = Infinity,
        skipTarget = () => false,
    } = options;

    return db.transaction(
        "r",
        db.commands,
        async () => {
            const map = new Map<string, IStoredCommand>();

            await db.commands.where("status").equals("pending").until(
                () => map.size >= maxTargets,
            ).each(
                (value, { primaryKey }) => {
                    // istanbul ignore else: debug assertion
                    if (DEBUG) {
                        assert(PositiveIntegerType.is(primaryKey));
                        assert(CommandTableValueType.is(value));
                        assert(value.status === "pending");

                        const prev = map.get(value.target);
                        assert(!prev || prev.key < primaryKey);
                    }

                    if (skipTarget(value.target) !== true && !map.has(value.target)) {
                        const command = makeStoredCommand(primaryKey, value);

                        // istanbul ignore else: debug assertion
                        if (DEBUG) {
                            assert(command !== null);
                        }

                        map.set(value.target, command!);
                    }
                },
            );

            return Array.from(map.values());
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
