import * as t from "io-ts";
import { CommandResult } from "./command-result";

/** @internal */
export const CommandResultType: t.Type<CommandResult> = t.keyof({
    accepted: null,
    pending: null,
    rejected: null,
});
