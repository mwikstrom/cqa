import { JsonValue } from "./json-value";

/** @public */
export interface IQueryResult {
    commit: string;
    data: JsonValue;
    timestamp: Date;
}
