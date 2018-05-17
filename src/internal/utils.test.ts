import {
    createIdentifier,
    demand,
} from "../internal";

describe("demand", () => {
    it("does nothing when condition is met", () => {
        demand(true);
    });

    it("throws an error when condition is not met", () => {
        expect(() => demand(false)).toThrowError("Invalid operation");
    });
});

describe("createIdentifier", () => {
    it("creates random 16-byte identifiers using base-64 url encoding", () => {
        const a = createIdentifier();
        const b = createIdentifier();
        expect(a).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(b).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(a).not.toBe(b);
    });

    it("can be told to create identifiers of custom length", () => {
        const id = createIdentifier(3);
        expect(id).toMatch(/^[0-9a-zA-Z_-]{4}$/);
    });
});
