import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { SupportedJsonWebKeyType } from "../json/supported-json-web-key-type";

/** @internal */
export const JsonCryptoOptionsType = t.partial({
    key: SupportedJsonWebKeyType,
    nonce: NonEmptyString,
});
