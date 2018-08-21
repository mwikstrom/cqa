import * as t from "io-ts";

/** @internal */
export const PositiveInteger = t.refinement(
    t.Integer,
    value => value > 0,
    "positive integer",
);
