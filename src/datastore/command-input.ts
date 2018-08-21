import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value";
import { CleanTypeOf } from "../utils/clean-type-of";

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
    }),
]);
