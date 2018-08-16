import * as t from "io-ts";
import { CommandInputType } from "../../internal/datastore/command-input";

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

    // TODO: Add and implement getPendingCommands(options?)
    // options are { maxTargets?: PositiveInteger, skipTargets?: target => boolean }

    // TODO: Add support for purging commands

    // TODO: Add support for marking command as accepted and rejected
}

type Clean<T> = Pick<T, keyof T>;
export type ICommandInput = Clean<t.TypeOf<typeof CommandInputType>>;

export interface IStoredCommand {
    id: string;
    key: number;
    payload: any;
    target: string;
    timestamp: number;
    type: string;
}
