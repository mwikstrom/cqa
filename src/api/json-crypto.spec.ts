import { SupportedJsonWebKeyType } from "../json/supported-json-web-key-type";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";
import { createJsonCrypto } from "./create-json-crypto";

describe("JsonCrypto", () => {
    it("supports roundtrip encrypt/export/import/decrypt", async () => {
        const crypto = await createJsonCrypto();
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain);
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ key });
        const decrypted = await imported.decrypt(encrypted);
        expect(decrypted).toMatchObject(plain);
    });

    it("does not support roundtrip encrypt/export/import/decrypt with incompatible nonce", async () => {
        const crypto = await createJsonCrypto({ nonce: "good" });
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain);
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ key, nonce: "bad" });
        await expect(imported.decrypt(encrypted)).rejects.toThrow();
    });

    it("does not support roundtrip encrypt/export/import/decrypt with incompatible context", async () => {
        const crypto = await createJsonCrypto();
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain, "good context");
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ key });
        await expect(imported.decrypt(encrypted, "bad conext")).rejects.toThrow();
    });

    it("generates supported json web keys", async () => {
        const crypto = await createJsonCrypto();
        const key = await crypto.exportKey();
        expect(SupportedJsonWebKeyType.is(key)).toBe(true);
    });

    it("can import/export pre-baked json web key", async () => {
        const key = {
            alg: "A256GCM",
            ext: true,
            k: "8aMU22JGTZiQ4P59OjUVnKSHVlx_-37RwJipN1O_vks",
            key_ops: [ "encrypt", "decrypt" ],
            kty: "oct",
        };

        const crypto = await createJsonCrypto({ key });
        const exported = await crypto.exportKey();
        expect(exported).toMatchObject(key);
    });
});
