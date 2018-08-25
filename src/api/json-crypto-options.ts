import { JsonValue } from "./json-value";

/** @public */
export interface IJsonCryptoOptions {
    key?: JsonWebKey;
    nonce?: JsonValue;
}
