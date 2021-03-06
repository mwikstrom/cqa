import { IDatastoreListener } from "./datastore-listener";
import { IJsonCrypto } from "./json-crypto";

/** @public */
export interface IDatastoreOptions {
    crypto: IJsonCrypto;
    name: string;
    now?: () => Date;
    on?: IDatastoreListener;
}
