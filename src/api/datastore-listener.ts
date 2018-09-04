import { ICommandListener } from "./command-listener";

/** @public */
export interface IDatastoreListener {
    close?: () => void;
    command?: ICommandListener;
    master?: () => void;
}
