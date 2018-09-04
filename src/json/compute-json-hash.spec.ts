import { JsonValue } from "../api/json-value";
import { uint8ArrayToBase64Url } from "../utils/uint8-array-to-base64-url";
import { computeJsonHash } from "./compute-json-hash";

const expect = chai.expect;

describe("computeJsonHash", () => {
    const computeAndEncode = async (input: JsonValue) =>
        uint8ArrayToBase64Url(new Uint8Array(await computeJsonHash(input)));

    it("returns a 20 byte long array buffer", async () => {
        const hash = await computeJsonHash({ a: 1, b: 2, c: null, d: [ "e" ] });
        expect(hash.byteLength).to.eq(20);
    });

    it("returns the same hash for the same input", async () => {
        const hash1 = await computeAndEncode({ a: 1, b: 2, c: null, d: [ "e" ] });
        const hash2 = await computeAndEncode({ a: 1, b: 2, c: null, d: [ "e" ] });
        expect(hash1).to.eq(hash2);
    });

    it("returns the same hash for inputs that just differ in key ordering", async () => {
        const hash1 = await computeAndEncode({ a: 1, b: 2, c: null, d: [ "e" ] });
        const hash2 = await computeAndEncode({ d: [ "e" ], a: 1, c: null, b: 2 });
        expect(hash1).to.eq(hash2);
    });

    it("returns the different hashes for different inputs", async () => {
        const hash1 = await computeAndEncode({ a: 1, b: 2, c: null, d: [ "e" ] });
        const hash2 = await computeAndEncode({ a: 1, b: 3, c: null, d: [ "e" ] });
        const hash3 = await computeAndEncode({ a: 1, b: 2, c: null, d: [ "f" ] });
        expect(hash1).not.to.eq(hash2);
        expect(hash1).not.to.eq(hash3);
        expect(hash2).not.to.eq(hash3);
    });
});
