import * as t from "io-ts";
import { NonEmptyString, PositiveIntegerType, SafeIntegerType } from "../common-runtime-types";
import { JsonValueType } from "../json-value-type";

export const CommandInputType = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        id: NonEmptyString,
        payload: JsonValueType,
        timestamp: t.Integer,
    }),
]);

const CommandStatusCodes = {
    accepted: true,
    pending: undefined,
    rejected: false,
};

export const CommandStatusType = t.keyof(CommandStatusCodes);

export const CommandTableValueType = t.refinement(
    t.intersection([
        t.interface({
            id: NonEmptyString,
            status: CommandStatusType,
            target: t.string,
            timestamp: SafeIntegerType,
            type: t.string,
        }),
        t.partial({
            commit: NonEmptyString,
            payload: JsonValueType,
        }),
    ]),
    cmd => isValidStatusAndCommit(cmd.status, cmd.commit),
);

export function isValidStatusAndCommit(
    status: string,
    commit: string | undefined,
): boolean {
    switch (status) {
        // Pending and rejected commands cannot have a commit version
        case "pending":
        case "rejected":
            return commit === undefined;

        // Accepted commands must have a non-empty commit version
        case "accepted":
            return NonEmptyString.is(commit);

        // Any other status is illegal
        default:
            return false;
    }
}

export const StoredCommandType = t.intersection([
        t.interface({
            key: PositiveIntegerType,
        }),
        CommandTableValueType,
]);

export const PendingCommandOptionsType = t.partial({
    maxTargets: PositiveIntegerType,
    skipTargets: t.Function,
});
