import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";
import { createJsonCrypto } from "./create-json-crypto";

describe("JsonCrypto", () => {
    it("supports roundtrip encrypt/export/import/decrypt", async () => {
        const crypto = await createJsonCrypto();
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain);
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ keyToImport: key });
        const decrypted = await imported.decrypt(encrypted);
        expect(decrypted).toMatchObject(plain);
    });

    it("does not support roundtrip encrypt/export/import/decrypt with incompatible nonce", async () => {
        const crypto = await createJsonCrypto({ nonce: "good" });
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain);
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ keyToImport: key, nonce: "bad" });
        await expect(imported.decrypt(encrypted)).rejects.toThrow();
    });

    it("does not support roundtrip encrypt/export/import/decrypt with incompatible context", async () => {
        const crypto = await createJsonCrypto();
        const plain = { message: "hello world", other: 123 };
        const encrypted = await crypto.encrypt(plain, "good context");
        const key = await crypto.exportKey();
        const imported = await createJsonCrypto({ keyToImport: key });
        await expect(imported.decrypt(encrypted, "bad conext")).rejects.toThrow();
    });
});
