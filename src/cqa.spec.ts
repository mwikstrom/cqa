import * as api from "./cqa";

describe("Public API", () => {
    const expectedFunctions = [
        "createCommand",
        "createQuery",
        "defineCommand",
        "defineQuery",
        "getQueryResult",
        "getQueryStatus",
        "lookupCommandType",
        "lookupQueryType",
        "tryLookupCommandAsync",
    ];

    const exportedNames = new Set(Object.keys(api));

    expectedFunctions.forEach(name => test(`'${name}' is an exported function`, () => {
        expect(exportedNames.delete(name)).toBe(true);
        expect(typeof api[name]).toBe("function");
    }));

    test("There are no unexpected exports", () => {
        expect(Array.from(exportedNames).join(", ")).toBe("");
    });
});
