import { jsonEquals } from "./json-equals";

describe("jsonEquals", () => {
    test("array and null", () => {
        expect(jsonEquals([], null)).toBe(false);
    });

    test("array of different lengths", () => {
        expect(jsonEquals([], [1])).toBe(false);
    });

    test("diff in array", () => {
        expect(jsonEquals([1], [2])).toBe(false);
    });
});
