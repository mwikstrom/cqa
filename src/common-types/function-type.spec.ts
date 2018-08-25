import { FunctionType } from "./function-type";

describe("FunctionType", () => {
    it("type guards", () => {
        const type = FunctionType();
        expect(type.is(() => 0)).toBe(true);
        expect(type.is(null)).toBe(false);
    });

    it("validates", () => {
        const type = FunctionType();
        expect(type.decode(() => 0).isRight()).toBe(true);
        expect(type.decode(null).isLeft()).toBe(true);
    });
});
