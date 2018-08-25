import { CommandResult } from "./command-result";
import { JsonValue } from "./json-value";

/** @public */
export interface ICommandData {
    commit: string;
    id: string;
    key: number;
    payload: JsonValue;
    result: CommandResult;
    target: string;
    type: string;
}
