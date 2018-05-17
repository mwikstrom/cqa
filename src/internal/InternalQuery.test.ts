import {
    UnknownQuery,
} from "../api";

import {
    internalOf,
} from "../internal";

describe("InternalQuery", () => {
    it("accepts snapshot", () => {
        const instance = internalOf(new UnknownQuery(null));
        instance.applySnapshot("data", "v1");
        expect(instance.pub.tryBuildSnapshot()).toBe("data");
        expect(instance.version).toBe("v1");
    });

    it("accepts update", () => {
        class DummyQuery extends UnknownQuery {
            public onUpdate() { /* no-op */ }
        }
        const instance = internalOf(new DummyQuery(null));
        instance.applyUpdate("data", "v1");
        expect(instance.version).toBe("v1");
    });

    it("accepts version", () => {
        const instance = internalOf(new UnknownQuery(null));
        instance.applyVersion("v1");
        expect(instance.version).toBe("v1");
    });
});
