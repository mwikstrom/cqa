import * as t from "io-ts";
import { IQueryData } from "../api/query-data";
import { NonEmptyString } from "../common-types/non-empty-string";
import { ValidDateType } from "../common-types/valid-date-type";
import { QueryDescriptorType } from "./query-descriptor-type";

/** @internal */
export const QueryDataType: t.Type<IQueryData> = t.interface({
    commit: NonEmptyString,
    descriptor: QueryDescriptorType,
    timestamp: ValidDateType,
});
