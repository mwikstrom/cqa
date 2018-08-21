import { JsonValue } from "./json-value";

/** @public */
export interface ICreateJsonCryptoOptions {
    keyToImport?: JsonWebKey;
    nonce?: JsonValue;
}
