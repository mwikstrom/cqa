import {
    DEBUG,
    LIB_NAME_LONG,
    LIB_NAME_SHORT,
} from "./env";

const expect = chai.expect;

describe("environment", () => {
    it("is debug", () => {
        expect(DEBUG).to.eq(true);
    });

    it("has the expected library name", () => {
        expect(LIB_NAME_SHORT).to.eq("cqa");
        expect(LIB_NAME_LONG).to.eq("Command Query App");
    });
});
