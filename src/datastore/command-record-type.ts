import * as t from "io-ts";
import { InstanceOf } from "../common-types/instance-of";
import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { ValidDateType } from "../common-types/valid-date-type";
import { ICommandRecord } from "./command-record";

/** @internal */
export const CommandRecordType: t.Type<ICommandRecord> = t.interface({
    commit: t.string,
    datacipher: InstanceOf(ArrayBuffer),
    key: PositiveInteger,
    resolved: t.boolean,
    salt: NonEmptyString,
    timestamp: ValidDateType,
});
