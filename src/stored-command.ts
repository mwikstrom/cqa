import * as t from "io-ts";
import { CleanTypeOf } from "./clean-type-of";
import { CommandTableValueType } from "./command-table-value";
import { PositiveInteger } from "./positive-integer";

/** @public */
export type IStoredCommand = CleanTypeOf<typeof StoredCommandType>;

/** @internal */
export const StoredCommandType = t.intersection([
    t.interface({
        key: PositiveInteger,
    }),
    CommandTableValueType,
]);
