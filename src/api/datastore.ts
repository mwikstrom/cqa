import { ICommandData } from "./command-data";
import { ICommandInput } from "./command-input";
import { JsonValue } from "./json-value";
import { IQueryData } from "./query-data";
import { IQueryDescriptor } from "./query-descriptor";
import { IQueryListOptions } from "./query-list-options";
import { IQueryResult } from "./query-result";
import { IUpdateQueryOptions } from "./update-query-options";

/** @public */
export interface IDatastore {
    addCommand(input: ICommandInput): Promise<ICommandData>;
    close(): void;
    getCommandList(): Promise<ICommandData[]>;
    getQueryList(options?: IQueryListOptions): Promise<IQueryData[]>;
    getQueryResult(query: IQueryDescriptor): Promise<IQueryResult | undefined>;
    setCommandAccepted(key: number, commit: string): Promise<boolean>;
    setCommandRejected(key: number): Promise<boolean>;
    setQueryResult(query: IQueryDescriptor, commit: string, data: JsonValue): Promise<string | undefined>;
    updateQueryResult(query: IQueryDescriptor, options: IUpdateQueryOptions): Promise<void>;
}
