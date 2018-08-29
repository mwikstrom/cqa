import * as t from "io-ts";
import { IQueryListOptions } from "../api/query-list-options";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value-type";

/** @internal */
export const QueryListOptionsType: t.Type<IQueryListOptions> = t.partial({
    param: JsonValueType,
    type: NonEmptyString,
});
