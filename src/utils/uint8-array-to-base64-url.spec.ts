import "../test-helpers/setup-webcrypto";
import { uint8ArrayToBase64Url } from "./uint8-array-to-base64-url";

describe("uint8ArrayToBase64Url", () => {
    [ 99, 100, 101 ].forEach(len => {
        it(`provides the same output as using btoa (len=${len})`, () => {
            const array = new Uint8Array(len);
            crypto.getRandomValues(array);
            const charmap: { [c: string]: string; } = { "+": "-", "/": "_" };
            const expected = btoa(String.fromCharCode.apply(null, array)).replace(/[+/=]/g, c => charmap[c] || "");
            const actual = uint8ArrayToBase64Url(array);
            expect(actual).toBe(expected);
        });
    });
});
