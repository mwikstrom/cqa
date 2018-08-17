import * as t from "io-ts";
import { PositiveIntegerType, SafeIntegerType } from "../common-runtime-types";
import { JsonValueType } from "../json-value-type";

export const CommandInputType = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        id: t.string,
        payload: JsonValueType,
        timestamp: t.Integer,
    }),
]);

export const StoredCommandType = t.intersection([
    t.interface({
        id: t.string,
        key: PositiveIntegerType,
        target: t.string,
        timestamp: SafeIntegerType,
        type: t.string,
    }),
    t.partial({
        payload: JsonValueType,
    }),
]);
