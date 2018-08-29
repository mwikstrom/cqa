import { JsonValue } from "./json-value";

export interface IQueryDescriptor {
    type: string;
    param?: JsonValue;
}
