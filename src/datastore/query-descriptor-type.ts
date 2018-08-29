import * as t from "io-ts";
import { IQueryDescriptor } from "../api/query-descriptor";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value-type";

export const QueryDescriptorType: t.Type<IQueryDescriptor> = t.intersection([
    t.interface({ type: NonEmptyString }),
    t.partial({ param: JsonValueType }),
]);
