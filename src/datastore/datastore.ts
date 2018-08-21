import { IActiveCommandOptions } from "./active-command-options";
import { ICommandInput } from "./command-input";
import { IPendingCommandOptions } from "./pending-command-options";
import { IStoredCommand } from "./stored-command";

/** @public */
export interface IDatastore {
    addCommand(
        input: ICommandInput,
    ): Promise<IStoredCommand>;

    close(): void;

    getActiveCommands(
        options?: IActiveCommandOptions,
    ): Promise<IStoredCommand[]>;

    getCommand(keyOrId: string | number): Promise<IStoredCommand | null>;

    getPendingCommands(
        options?: IPendingCommandOptions,
    ): Promise<IStoredCommand[]>;

    // TODO: Add purgeCommands({ until })

    // TODO: Add setCommandResult({ status, commit })
}
