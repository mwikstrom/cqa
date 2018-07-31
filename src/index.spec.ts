import * as api from ".";

describe("API", () => {
    const expectedFunctions = [
        "isJsonValue",
        "openDatastore",
    ];

    const exportedObjects = {
    };

    const exportedNames = new Set(Object.keys(api));

    expectedFunctions.forEach(name => test(`'${name}' is an exported function`, () => {
        expect(exportedNames.delete(name)).toBe(true);
        expect(typeof api[name]).toBe("function");
    }));

    Object.keys(exportedObjects).forEach(name => test(`'${name}' is the expected exported object`, () => {
        expect(exportedNames.delete(name)).toBe(true);
        expect(api[name]).toBe(exportedObjects[name]);
    }));

    test("There are no unexpected exports", () => {
        expect(Array.from(exportedNames).map(name => `${name} <${typeof api[name]}>`).join(", ")).toBe("");
    });
});
