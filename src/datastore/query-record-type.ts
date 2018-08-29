import * as t from "io-ts";
import { InstanceOf } from "../common-types/instance-of";
import { NonEmptyString } from "../common-types/non-empty-string";
import { RegExpMatch } from "../common-types/reg-exp-match";
import { ValidDateType } from "../common-types/valid-date-type";
import { IQueryRecord } from "./query-record";

/** @internal */
export const QueryRecordType: t.Type<IQueryRecord> = t.interface({
    commit: NonEmptyString,
    key: RegExpMatch(/^[0-9a-f]{40}$/),
    paramcipher: InstanceOf(ArrayBuffer),
    timestamp: ValidDateType,
    type: NonEmptyString,
});
