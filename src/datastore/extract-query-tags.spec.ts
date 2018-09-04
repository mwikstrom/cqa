import { extractQueryTags } from "./extract-query-tags";

const expect = chai.expect;

describe("extractQueryTags", () => {
    it("returns the expected result", () => {
        const input = {
            a: 123,
            b: null,
            c: [ { d: "hello" }, "world" ],
            e: {},
            f: [],
            g: { h: "i" },
            i: { j: [ { k: [] }]},
        };

        const expected = [
            [ "a",  123 ],
            [ "b", null ],
            [ "c", [], {}, "d", "hello" ],
            [ "c", [], "world" ],
            [ "g", {}, "h", "i" ],
        ];

        const actual = extractQueryTags(input);
        expect(actual).to.deep.eq(expected);
    });
});
