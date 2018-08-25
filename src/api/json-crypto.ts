import { JsonValue } from "./json-value";

/** @public */
export interface IJsonCrypto {
    decrypt(data: ArrayBuffer, context?: JsonValue): Promise<JsonValue>;
    encrypt(value: JsonValue, context?: JsonValue): Promise<ArrayBuffer>;
    exportKey(): Promise<JsonWebKey>;
}
