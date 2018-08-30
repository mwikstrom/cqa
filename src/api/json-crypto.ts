import { JsonValue } from "./json-value";

/** @public */
export interface IJsonCrypto {
    decrypt(data: ArrayBuffer, context?: JsonValue | ArrayBuffer): Promise<JsonValue>;
    encrypt(value: JsonValue, context?: JsonValue | ArrayBuffer): Promise<ArrayBuffer>;
    exportKey(): Promise<JsonWebKey>;
}
