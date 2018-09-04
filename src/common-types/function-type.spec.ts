import { FunctionType } from "./function-type";

const expect = chai.expect;

describe("FunctionType", () => {
    it("type guards", () => {
        const type = FunctionType();
        expect(type.is(() => 0)).to.eq(true);
        expect(type.is(null)).to.eq(false);
    });

    it("validates", () => {
        const type = FunctionType();
        expect(type.decode(() => 0).isRight()).to.eq(true);
        expect(type.decode(null).isLeft()).to.eq(true);
    });
});
