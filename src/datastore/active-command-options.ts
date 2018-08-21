import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { CleanTypeOf } from "../utils/clean-type-of";

/** @public */
export type IActiveCommandOptions = CleanTypeOf<typeof ActiveCommandOptionsType>;

/** @internal */
export const ActiveCommandOptionsType = t.partial({
    after: NonEmptyString,
});
