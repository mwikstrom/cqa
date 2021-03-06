import { assert } from "./assert";

const expect = chai.expect;

describe("assert", () => {
    it("does not throw when condition is true", () => {
        assert(true);
    });

    it("throws when condition is false", () => {
        expect(() => assert(false)).to.throw();
    });
});
