import { IQueryDescriptor } from "../api/query-descriptor";
import { computeQueryKey } from "./compute-query-key";

describe("computeQueryKey", () => {
    it("returns a 40 character long lower case hex string", () => {
        const descriptor: IQueryDescriptor = { type: "x" };
        const key = computeQueryKey(descriptor);
        expect(key).toMatch(/^[0-9a-f]{40}$/);
    });

    it("returns the same result for the same descriptor", () => {
        const key1 = computeQueryKey({ type: "x", param: { a: 1 }});
        const key2 = computeQueryKey({ type: "x", param: { a: 1 }});
        expect(key1).toBe(key2);
    });

    it("returns the different results for the different descriptors", () => {
        const key1 = computeQueryKey({ type: "x", param: { a: 1 }});
        const key2 = computeQueryKey({ type: "x", param: { a: 2 }});
        const key3 = computeQueryKey({ type: "y", param: { a: 1 }});
        expect(key1).not.toBe(key2);
        expect(key1).not.toBe(key3);
        expect(key2).not.toBe(key3);
    });
});
