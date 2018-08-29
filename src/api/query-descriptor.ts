import { JsonValue } from "./json-value";

/** @public */
export interface IQueryDescriptor {
    type: string;
    param?: JsonValue;
}
