import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value-type";
import { IProtectedCommandData } from "./protected-command-data";

/** @internal */
export const ProtectedCommandDataType: t.Type<IProtectedCommandData> = t.interface({
    id: NonEmptyString,
    payload: JsonValueType,
    target: NonEmptyString,
    type: NonEmptyString,
});
