import { verify } from "../utils/verify";
import { IJsonCrypto } from "./json-crypto";
import { IJsonCryptoOptions, JsonCryptoOptionsType } from "./json-crypto-options";
import { JsonValue } from "./json-value";

const CRYPTO_ALGORITHM_NAME = "AES-GCM";
const CRYPTO_ALGORITHM_LENGTH = 256;
const CRYPTO_KEY_ALGORITHM = { length: CRYPTO_ALGORITHM_LENGTH, name: CRYPTO_ALGORITHM_NAME };
const KEY_IS_EXTRACTABLE = true;
const KEY_USAGES = [ "encrypt", "decrypt" ];

/** @public */
export async function createJsonCrypto(
    options: IJsonCryptoOptions = {},
): Promise<IJsonCrypto> {
    verify("json crypto options", options, JsonCryptoOptionsType);

    const { nonce = "JSON_CRYPTO_DUMMY_NONCE" } = options;

    const key = await importOrGenerateKey(options.key);
    const iv = encode(nonce);

    async function decrypt(
        data: ArrayBuffer,
        context?: JsonValue,
    ): Promise<JsonValue> {
        const params = createCryptoParams(context);
        const decrypted = await crypto.subtle.decrypt(params, key, data);
        return decode(decrypted);
    }

    async function encrypt(
        value: JsonValue,
        context?: JsonValue,
    ): Promise<ArrayBuffer> {
        const encoded = encode(value);
        const params = createCryptoParams(context);
        return await crypto.subtle.encrypt(params, key, encoded);
    }

    async function exportKey(): Promise<JsonWebKey> {
        return await crypto.subtle.exportKey(
            "jwk",
            key,
        );
    }

    function createCryptoParams(
        context?: JsonValue,
    ): AesGcmParams {
        const result: AesGcmParams = {
            iv,
            name: CRYPTO_ALGORITHM_NAME,
        };

        if (context) {
            result.additionalData = encode(context);
        }

        return result;
    }

    return {
        decrypt,
        encrypt,
        exportKey,
    };
}

async function importOrGenerateKey(
    keyToImport?: JsonWebKey,
): Promise<CryptoKey> {
    if (keyToImport) {
        return await crypto.subtle.importKey("jwk", keyToImport, CRYPTO_KEY_ALGORITHM, KEY_IS_EXTRACTABLE, KEY_USAGES);
    } else {
        return await crypto.subtle.generateKey(CRYPTO_KEY_ALGORITHM, KEY_IS_EXTRACTABLE, KEY_USAGES);
    }
}

function encode(
    value: JsonValue,
): Uint8Array {
    const encoder = new TextEncoder();
    const str = JSON.stringify(value);
    return encoder.encode(str);
}

function decode(
    data: ArrayBuffer,
): JsonValue {
    const decoder = new TextDecoder();
    const str = decoder.decode(data);
    return JSON.parse(str);
}
