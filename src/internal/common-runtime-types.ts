import * as t from "io-ts";

export const PositiveIntegerType = t.refinement(
    t.Integer,
    value => value > 0,
    "positive integer",
);

export const SafeIntegerType = t.refinement(
    t.Integer,
    value => value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER,
    "safe integer",
);
