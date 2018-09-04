import { jsonEquals } from "./json-equals";

const expect = chai.expect;

describe("jsonEquals", () => {
    it("can test array and null", () => {
        expect(jsonEquals([], null)).to.eq(false);
    });

    it("can test array of different lengths", () => {
        expect(jsonEquals([], [1])).to.eq(false);
    });

    it("can test diff in array", () => {
        expect(jsonEquals([1], [2])).to.eq(false);
    });
});
