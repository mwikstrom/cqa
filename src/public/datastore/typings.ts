import { CleanTypeOf } from "../../internal/common-runtime-types";
import { CommandInputType, StoredCommandType } from "../../internal/datastore/runtime-types";

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

export type ICommandInput = CleanTypeOf<typeof CommandInputType>;

export type IStoredCommand = CleanTypeOf<typeof StoredCommandType>;

export interface IPendingCommandOptions {
    maxTargets?: number;
    skipTarget?: SkipTargetPredicate;
}

export type SkipTargetPredicate = (target: string) => boolean;
