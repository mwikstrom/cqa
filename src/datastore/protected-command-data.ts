import { JsonValue } from "../api/json-value";

/** @internal */
export interface IProtectedCommandData {
    id: string;
    payload: JsonValue;
    target: string;
    type: string;
}
