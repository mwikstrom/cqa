import * as t from "io-ts";
import { FunctionType } from "../common-types/function-type";
import { JsonValue } from "./json-value";

/** @public */
export interface IJsonCrypto {
    decrypt(data: ArrayBuffer, context?: JsonValue): Promise<JsonValue>;
    encrypt(value: JsonValue, context?: JsonValue): Promise<ArrayBuffer>;
    exportKey(): Promise<JsonWebKey>;
}

/** @internal */
export const JsonCryptoType: t.Type<IJsonCrypto> = t.interface({
    decrypt: FunctionType<IJsonCrypto["decrypt"]>(),
    encrypt: FunctionType<IJsonCrypto["encrypt"]>(),
    exportKey: FunctionType<IJsonCrypto["exportKey"]>(),
});
