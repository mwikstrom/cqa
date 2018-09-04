/** @public */
export interface IDatastoreListener {
    master?: () => void;
    close?: () => void;
}
