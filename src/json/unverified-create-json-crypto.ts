import { IJsonCrypto } from "../api/json-crypto";
import { IJsonCryptoOptions } from "../api/json-crypto-options";
import { JsonValue } from "../api/json-value";
import { InstanceOf } from "../common-types/instance-of";
import { verify, withVerification } from "../utils/verify";
import { decodeJson } from "./decode-json";
import { encodeJson } from "./encode-json";
import { JsonValueType } from "./json-value-type";

const CRYPTO_ALGORITHM_NAME = "AES-GCM";
const CRYPTO_ALGORITHM_LENGTH = 256;
const CRYPTO_KEY_ALGORITHM = { length: CRYPTO_ALGORITHM_LENGTH, name: CRYPTO_ALGORITHM_NAME };
const KEY_IS_EXTRACTABLE = true;
const KEY_USAGES = [ "encrypt", "decrypt" ];

/** @internal */
export async function unverifiedCreateJsonCrypto(
    options: IJsonCryptoOptions,
): Promise<IJsonCrypto> {
    const { nonce = "JSON_CRYPTO_DUMMY_NONCE" } = options;

    const key = await importOrGenerateKey(options.key);
    const iv = encodeJson(nonce);

    async function unverifiedDecrypt(
        data: ArrayBuffer,
        context?: JsonValue,
    ): Promise<JsonValue> {
        const params = createCryptoParams(context);
        const decrypted = await crypto.subtle.decrypt(params, key, data);
        return decodeJson(decrypted);
    }

    async function unverifiedEncrypt(
        value: JsonValue,
        context?: JsonValue,
    ): Promise<ArrayBuffer> {
        const encoded = encodeJson(value);
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
            result.additionalData = encodeJson(context);
        }

        return result;
    }

    const decrypt = withVerification(
        unverifiedDecrypt,
        (data, context) => {
            verify("data to decrypt", data, InstanceOf(ArrayBuffer));
            if (context) {
                verify("encryption context", context, JsonValueType);
            }
        },
    );

    const encrypt = withVerification(
        unverifiedEncrypt,
        (value, context) => {
            verify("value to encrypt", value, JsonValueType);
            if (context) {
                verify("decryption context", context, JsonValueType);
            }
        },
    );

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
