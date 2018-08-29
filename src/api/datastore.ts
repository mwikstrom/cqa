import { ICommandData } from "./command-data";
import { ICommandInput } from "./command-input";

/** @public */
export interface IDatastore {
    addCommand(input: ICommandInput): Promise<ICommandData>;
    close(): void;
    getCommandList(): Promise<ICommandData[]>;
    // getQueryList(options: IQueryListOptions): Promise<IQueryData>;
    // getQueryResult(query: IQueryDescriptor): Promise<IQueryResult | undefined>;
    setCommandAccepted(key: number, commit: string): Promise<boolean>;
    setCommandRejected(key: number): Promise<boolean>;
    // setQueryResult(query: IQueryDescriptor, result: IQueryResult): Promise<void>;
    // updateQueryResult(query: IQueryDescriptor, options: IPatchQueryOptions): Promise<void>;
}
