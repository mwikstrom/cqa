import { ICommandData } from "./command-data";
import { ICommandInput } from "./command-input";
import { IQueryDescriptor } from "./query-descriptor";

/** @public */
export interface IDatastore {
    addCommand(input: ICommandInput): Promise<ICommandData>;
    close(): void;
    // TODO: findByQueryType(...)
    getCommandList(): Promise<ICommandData[]>;
    getQueryKey(descriptor: IQueryDescriptor): string;
    // TODO: getQueryResult(key: string): Promise<IQueryResult | undefined>;
    // TODO: patchQueryResult(key: string, options: IPatchQueryOptions): Promise<void>;
    setCommandAccepted(key: number, commit: string): Promise<boolean>;
    setCommandRejected(key: number): Promise<boolean>;
    // TODO: setQueryResult(key: string, result: IQueryResult): Promise<void>;
}
