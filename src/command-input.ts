import * as t from "io-ts";
import { CleanTypeOf } from "./clean-type-of";
import { JsonValueType } from "./json-value";
import { NonEmptyString } from "./non-empty-string";

/** @public */
export type ICommandInput = CleanTypeOf<typeof CommandInputType>;

/** @internal */
export const CommandInputType = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        id: NonEmptyString,
        payload: JsonValueType,
        timestamp: t.Integer,
    }),
]);
