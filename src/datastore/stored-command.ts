import * as t from "io-ts";
import { PositiveInteger } from "../common-types/positive-integer";
import { CleanTypeOf } from "../utils/clean-type-of";
import { CommandTableValueType } from "./command-table-value";

/** @public */
export type IStoredCommand = CleanTypeOf<typeof StoredCommandType>;

/** @internal */
export const StoredCommandType = t.intersection([
    t.interface({
        key: PositiveInteger,
    }),
    CommandTableValueType,
]);
