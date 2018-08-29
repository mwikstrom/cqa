import * as t from "io-ts";
import { IQueryResult } from "../api/query-result";
import { NonEmptyString } from "../common-types/non-empty-string";
import { ValidDateType } from "../common-types/valid-date-type";
import { JsonValueType } from "../json/json-value-type";

/** @internal */
export const QueryResultType: t.Type<IQueryResult> = t.interface({
    commit: NonEmptyString,
    data: JsonValueType,
    timestamp: ValidDateType,
});
