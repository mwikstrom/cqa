import * as index from "../src/index";
const api = index as any;

describe("API", () => {
    const expectedFunctions = [
        "isJsonValue",
        "openDatastore",
    ];

    const expectedDeclarations = [
        "ICommandInput",
        "IDatastore",
        "IJsonArray",
        "IJsonObject",
        "JsonValue",
        "IPendingCommandOptions",
        "SkipTargetPredicate",
        "IStoredCommand",
    ];

    const exportedNames = new Set(Object.keys(api));

    expectedDeclarations.forEach(name => test(`'${name} is an exported declaration`, () => {
        expect(exportedNames.delete(name)).toBe(true);
        expect(api[name]).toBeUndefined();
    }));

    expectedFunctions.forEach(name => test(`'${name}' is an exported function`, () => {
        expect(exportedNames.delete(name)).toBe(true);
        expect(typeof api[name]).toBe("function");
    }));

    test("There are no unexpected exports", () => {
        expect(Array.from(exportedNames).map(name => `${name} <${typeof api[name]}>`).join(", ")).toBe("");
    });
});
