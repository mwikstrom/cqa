import * as index from "./index";
const api = index as any;

const expect = chai.expect;

describe("Public API", () => {
    const expectedFunctions = [
        "isJsonValue",
        "openDatastore",
        "createJsonCrypto",
        "patchJson",
    ];

    const exportedNames = new Set(Object.keys(api));

    expectedFunctions.forEach(name => it(`exports a function named '${name}'`, () => {
        expect(exportedNames.delete(name)).to.eq(true);
        expect(typeof api[name]).to.eq("function");
    }));

    it("has no unexpected exports", () => {
        expect(Array.from(exportedNames).map(name => `${name} <${typeof api[name]}>`).join(", ")).to.eq("");
    });
});
