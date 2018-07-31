import * as t from "io-ts";
import { JsonValueType } from "../json-runtime";

export const CommandInputType = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        // TODO: Add optional id prop (globally unique)
        payload: JsonValueType,
        timestamp: t.Integer,
    }),
]);
