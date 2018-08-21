import * as t from "io-ts";
import { CleanTypeOf } from "./clean-type-of";
import { NonEmptyString } from "./non-empty-string";

/** @public */
export type IActiveCommandOptions = CleanTypeOf<typeof ActiveCommandOptionsType>;

/** @internal */
export const ActiveCommandOptionsType = t.partial({
    after: NonEmptyString,
});
