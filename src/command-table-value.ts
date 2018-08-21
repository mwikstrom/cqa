import * as t from "io-ts";
import { CleanTypeOf } from "./clean-type-of";
import { CommandStatusType } from "./command-status";
import { isValidStatusAndCommit } from "./is-valid-status-and-commit";
import { JsonValueType } from "./json-value";
import { NonEmptyString } from "./non-empty-string";
import { SafeInteger } from "./safe-integer";

/** @internal */
export type ICommandTableValue = CleanTypeOf<typeof CommandTableValueType>;

/** @internal */
export const CommandTableValueType = t.refinement(
    t.intersection([
        t.interface({
            id: NonEmptyString,
            status: CommandStatusType,
            target: t.string,
            timestamp: SafeInteger,
            type: t.string,
        }),
        t.partial({
            commit: NonEmptyString,
            payload: JsonValueType,
        }),
    ]),
    cmd => isValidStatusAndCommit(cmd.status, cmd.commit),
);
