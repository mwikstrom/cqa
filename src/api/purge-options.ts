import { IQueryDescriptor } from "./query-descriptor";

/** @public */
export interface IPurgeOptions {
    activeQueries?: IQueryDescriptor[];
    commandRetentionPeriod?: number;
    queryRetentionPeriod?: number;
}
