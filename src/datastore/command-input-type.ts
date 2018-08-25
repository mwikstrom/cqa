import * as t from "io-ts";
import { ICommandInput } from "../api/command-input";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value-type";

/** @internal */
export const CommandInputType: t.Type<ICommandInput> = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        id: NonEmptyString,
        payload: JsonValueType,
    }),
]);
