import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value";
import { ICommandInput } from "./command-input";

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
