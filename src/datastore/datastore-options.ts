import { IJsonCrypto } from "../json/json-crypto";

/** @public */
export interface IDatastoreOptions {
    crypto: IJsonCrypto;
    name: string;
}
