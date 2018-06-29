import * as api from "./cqa";

import { timestamp } from "./api/timestamp";

describe("Public API", () => {
    const expectedFunctions = [
    ];

    const exportedObjects = {
        timestamp,
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
        expect(Array.from(exportedNames).join(", ")).toBe("");
    });
});
