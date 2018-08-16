import { assert } from "./assert";

describe("assert", () => {
    it("does not throw when condition is true", () => {
        assert(true);
    });

    it("throws when condition is false", () => {
        expect(() => assert(false)).toThrow();
    });
});
