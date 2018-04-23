import { demand } from "./demand";

describe("demand", () => {
    it("does nothing when condition is met", () => {
        demand(true);
    });

    it("throws an error when condition is not met", () => {
        expect(() => demand(false)).toThrowError("Invalid operation");
    });
});
