import { JsonCryptoOptionsType } from "../json/json-crypto-options-type";
import { unverifiedCreateJsonCrypto } from "../json/unverified-create-json-crypto";
import { verify, withVerification } from "../utils/verify";
import { IJsonCrypto } from "./json-crypto";
import { IJsonCryptoOptions } from "./json-crypto-options";

let wrapped: typeof unverifiedCreateJsonCrypto;

/** @public */
export function createJsonCrypto(
    options: IJsonCryptoOptions = {},
): Promise<IJsonCrypto> {
    if (!wrapped) {
        wrapped = withVerification(
            unverifiedCreateJsonCrypto,
            opts => verify("json crypto options", opts, JsonCryptoOptionsType),
        );
    }

    return wrapped(options);
}
