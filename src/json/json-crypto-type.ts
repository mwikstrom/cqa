import * as t from "io-ts";
import { IJsonCrypto } from "../api/json-crypto";
import { FunctionType } from "../common-types/function-type";

/** @internal */
export const JsonCryptoType: t.Type<IJsonCrypto> = t.interface({
    decrypt: FunctionType<IJsonCrypto["decrypt"]>(),
    encrypt: FunctionType<IJsonCrypto["encrypt"]>(),
    exportKey: FunctionType<IJsonCrypto["exportKey"]>(),
});
