import * as t from "io-ts";
import { JsonValueType } from "../json-runtime";

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