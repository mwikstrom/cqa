import { ICommandData } from "./command-data";

/** @public */
export interface ICommandListener {
    added?: (data: ICommandData) => void;
    accepted?: (key: number, commit: string) => void;
    rejected?: (key: number) => void;
}
