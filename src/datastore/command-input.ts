import * as t from "io-ts";
import { JsonValueType } from "../common-types/json-value";
import { NonEmptyString } from "../common-types/non-empty-string";
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
