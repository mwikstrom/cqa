import { CleanTypeOf } from "../../internal/common-runtime-types";
import { CommandInputType, StoredCommandType } from "../../internal/datastore/runtime-types";

export interface IDatastore {
    // TODO: Add option to specify crypto
    addCommand(
        input: ICommandInput,
    ): Promise<IStoredCommand>;

    close(): void;

    getCommandById(
        id: string,
    ): Promise<IStoredCommand | null>;

    getCommandByKey(
        key: number,
    ): Promise<IStoredCommand | null>;

    getPendingCommands(
        options?: IPendingCommandOptions,
    ): Promise<IStoredCommand[]>;

    // TODO: Add support for purging commands

    // TODO: Add support for marking command as accepted and rejected
}

export type ICommandInput = CleanTypeOf<typeof CommandInputType>;

export type IStoredCommand = CleanTypeOf<typeof StoredCommandType>;

export interface IPendingCommandOptions {
    maxTargets?: number;
    skipTarget?: SkipTargetPredicate;
}

export type SkipTargetPredicate = (target: string) => boolean;
