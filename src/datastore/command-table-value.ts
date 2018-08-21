import * as t from "io-ts";
import { JsonValueType } from "../common-types/json-value";
import { NonEmptyString } from "../common-types/non-empty-string";
import { CleanTypeOf } from "../utils/clean-type-of";
import { CommandStatusType } from "./command-status";
import { isValidStatusAndCommit } from "./is-valid-status-and-commit";

/** @internal */
export type ICommandTableValue = CleanTypeOf<typeof CommandTableValueType>;

/** @internal */
export const CommandTableValueType = t.refinement(
    t.intersection([
        t.interface({
            id: NonEmptyString,
            status: CommandStatusType,
            target: t.string,
            type: t.string,
        }),
        t.partial({
            commit: NonEmptyString,
            payload: JsonValueType,
        }),
    ]),
    cmd => isValidStatusAndCommit(cmd.status, cmd.commit),
);
