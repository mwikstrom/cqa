import * as t from "io-ts";

/** @internal */
export const SafeInteger = t.refinement(
    t.Integer,
    value => value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER,
    "safe integer",
);
