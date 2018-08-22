import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValue } from "./json-value";
import { SupportedJsonWebKeyType } from "./supported-json-web-key-type";

/** @public */
export interface IJsonCryptoOptions {
    key?: JsonWebKey;
    nonce?: JsonValue;
}

/** @internal */
export const JsonCryptoOptionsType = t.partial({
    key: SupportedJsonWebKeyType,
    nonce: NonEmptyString,
});
