import {
    createIdentifier,
    demand,
    freezeDeep,
    hashOf,
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

describe("freezeDeep", () => {
    it("can freeze object in array", () => {
        const unfrozenObj = { hello: "world" };
        const unfrozenArray = [ unfrozenObj ];
        const frozenArray = freezeDeep(unfrozenArray);
        expect(frozenArray).not.toBe(unfrozenArray);
        const frozenObj = frozenArray[0];
        expect(frozenObj).not.toBe(unfrozenObj);
        expect(frozenObj).toMatchObject(unfrozenObj);
        expect(frozenArray).toMatchObject(unfrozenArray);
        expect(() => frozenObj.hello = "rejected").toThrow();
        const frozenArray2 = freezeDeep(frozenArray);
        expect(frozenArray2).toBe(frozenArray);
        const hash1 = hashOf(unfrozenArray);
        const hash2 = hashOf(frozenArray);
        const hash3 = hashOf(frozenArray2);
        expect(hash1).toBe(hash2);
        expect(hash2).toBe(hash3);
    });
});
