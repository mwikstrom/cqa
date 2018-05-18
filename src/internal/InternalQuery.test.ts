import {
    autorun,
    when,
} from "mobx";

import {
    App,
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
        instance.applyVersion("v2");
        expect(instance.version).toBe("v2");
    });

    it("can be populated from a clome", async () => {
        const q1 = internalOf(new UnknownQuery(null));
        const q2 = internalOf(new UnknownQuery(null));
        const app = new App();
        const stop = autorun(() => {
            q1.reportObserved();
            q2.reportObserved();
        });

        q1.applySnapshot("hello world", "v1");
        q1.pub.attachTo(app);

        q2.pub.attachTo(app);
        await when(() => !q2.isPopulating);

        expect(q2.pub.tryBuildSnapshot()).toBe("hello world");
        expect(q2.version).toBe("v1");
    });
});
