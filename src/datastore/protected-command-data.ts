import { JsonValue } from "../json/json-value";

/** @internal */
export interface IProtectedCommandData {
    id: string;
    payload: JsonValue;
    target: string;
    type: string;
}
