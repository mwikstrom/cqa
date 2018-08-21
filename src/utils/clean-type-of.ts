import * as t from "io-ts";

type Clean<T> = Pick<T, keyof T>;

/** @internal */
export type CleanTypeOf<T extends t.Type<any>> = Clean<t.TypeOf<T>>;
