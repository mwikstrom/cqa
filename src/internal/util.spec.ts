import {
    validateValue,
} from "./util";

describe("validateValue", () => {
    test("Throws error with JSON value", () => {
        expect(() => validateValue([1, 2], () => false, "value"))
            .toThrow("Invalid value: [1,2]");
    });
});
