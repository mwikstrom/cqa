import { UnknownQuery } from "../api";

describe("UnknownQuery", () => {
    it("does not support incremental updates", () => {
        const instance = new UnknownQuery(null, "");
        expect(instance.supportsIncrementalUpdates).toBe(false);
    });

    it("builds a new key when none is given to constructor", () => {
        const instance = new UnknownQuery(null);
        expect(instance.buildKey()).toMatch(/^[0-9a-zA-Z_-]{27}$/);
    });

    it("returns the key given to constructor", () => {
        const instance = new UnknownQuery(null, "test");
        expect(instance.buildKey()).toBe("test");
    });
});
