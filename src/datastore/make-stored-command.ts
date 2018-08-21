import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { CommandTableValueType, ICommandTableValue } from "./command-table-value";
import { IStoredCommand, StoredCommandType } from "./stored-command";

/** @internal */
export function makeStoredCommand(
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
        type,
    } = value;

    const result: IStoredCommand = {
        commit,
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
