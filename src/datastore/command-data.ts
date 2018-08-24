import { JsonValue } from "../json/json-value";
import { CommandResult } from "./command-result";

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
