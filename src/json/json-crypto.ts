import * as t from "io-ts";
import { JsonValue } from "./json-value";

/** @public */
export interface IJsonCrypto {
    decrypt(data: ArrayBuffer, context?: JsonValue): Promise<JsonValue>;
    encrypt(value: JsonValue, context?: JsonValue): Promise<ArrayBuffer>;
    exportKey(): Promise<JsonWebKey>;
}

/** @internal */
export const JsonCryptoType = t.interface({
    decrypt: t.Function,
    encrypt: t.Function,
    exportKey: t.Function,
});
