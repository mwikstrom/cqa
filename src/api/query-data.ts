import { IQueryDescriptor } from "./query-descriptor";

/** @public */
export interface IQueryData {
    commit: string;
    descriptor: IQueryDescriptor;
    timestamp: Date;
}
