import { IJsonCrypto } from "./json-crypto";

/** @public */
export interface IDatastoreOptions {
    crypto: IJsonCrypto;
    name: string;
}
