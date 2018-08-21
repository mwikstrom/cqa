import * as t from "io-ts";

/** @internal */
export const NonEmptyString = t.refinement(
    t.string,
    value => value.length > 0,
    "non-empty string",
);
