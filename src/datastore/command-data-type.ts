import * as t from "io-ts";
import { ICommandData } from "../api/command-data";
import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { JsonValueType } from "../json/json-value-type";
import { CommandResultType } from "./command-result-type";

/** @internal */
export const CommandDataType: t.Type<ICommandData> = t.interface({
    commit: t.string,
    id: NonEmptyString,
    key: PositiveInteger,
    payload: JsonValueType,
    result: CommandResultType,
    target: NonEmptyString,
    type: NonEmptyString,
});
