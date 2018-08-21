import { ICommandInput } from "./command-input";
import { IPendingCommandOptions } from "./pending-command-options";
import { IStoredCommand } from "./stored-command";

/** @public */
export interface IDatastore {
    addCommand(
        input: ICommandInput,
    ): Promise<IStoredCommand>;

    close(): void;

    // TODO: Add getActiveCommands({ after });

    getCommandById(
        id: string,
    ): Promise<IStoredCommand | null>;

    getCommandByKey(
        key: number,
    ): Promise<IStoredCommand | null>;

    getPendingCommands(
        options?: IPendingCommandOptions,
    ): Promise<IStoredCommand[]>;

    // TODO: Add purgeCommands({ until })

    // TODO: Add setCommandResult({ status, commit })
}
