import * as t from "io-ts";
import { PositiveIntegerType, SafeIntegerType } from "../common-runtime-types";
import { JsonValueType } from "../json-value-type";

export const CommandInputType = t.intersection([
    t.interface({
        target: t.string,
        type: t.string,
    }),
    t.partial({
        id: t.string,
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
            id: t.string,
            status: CommandStatusType,
            target: t.string,
            timestamp: SafeIntegerType,
            type: t.string,
        }),
        t.partial({
            commit: t.string,
            payload: JsonValueType,
        }),
    ]),
    cmd => cmd.status === "pending"
        ? t.undefined.is(cmd.commit)
        : cmd.status === "accepted"
        ? t.string.is(cmd.commit)
        : true,
);

export const StoredCommandType = t.intersection([
        t.interface({
            key: PositiveIntegerType,
        }),
        CommandTableValueType,
]);
