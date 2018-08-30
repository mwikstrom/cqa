import * as t from "io-ts";
import { InstanceOf } from "../common-types/instance-of";
import { NonEmptyString } from "../common-types/non-empty-string";
import { ValidDateType } from "../common-types/valid-date-type";
import { IQueryRecord } from "./query-record";

/** @internal */
export const QueryRecordType: t.Type<IQueryRecord> = t.interface({
    commit: NonEmptyString,
    descriptorcipher: InstanceOf(ArrayBuffer),
    key: InstanceOf(ArrayBuffer),
    tags: t.array(InstanceOf<ArrayBufferConstructor, [number], ArrayBuffer>(ArrayBuffer)),
    timestamp: ValidDateType,
});
