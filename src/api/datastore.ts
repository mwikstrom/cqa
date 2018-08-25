import { ICommandData } from "./command-data";
import { ICommandInput } from "./command-input";

/** @public */
export interface IDatastore {
    addCommand(input: ICommandInput): Promise<ICommandData>;
    close(): void;
    getCommandList(): Promise<ICommandData[]>;
    setCommandAccepted(key: number, commit: string): Promise<boolean>;
    setCommandRejected(key: number): Promise<boolean>;
}
