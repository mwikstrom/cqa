import { JsonValue } from "../json/json-value";

/** @public */
export interface ICommandInput {
    id?: string;
    payload?: JsonValue;
    target: string;
    type: string;
}
