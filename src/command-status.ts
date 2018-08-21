import * as t from "io-ts";

const CommandStatusCodes = {
    accepted: true,
    pending: undefined,
    rejected: false,
};

/** @internal */
export const CommandStatusType = t.keyof(CommandStatusCodes);
