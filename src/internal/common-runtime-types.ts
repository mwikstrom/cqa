import * as t from "io-ts";

type Clean<T> = Pick<T, keyof T>;
export type CleanTypeOf<T extends t.Type<any>> = Clean<t.TypeOf<T>>;

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

export const NonEmptyString = t.refinement(
    t.string,
    value => value.length > 0,
    "non-empty string",
);
