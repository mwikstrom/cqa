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
    SILENT_CONSOLE,
} from "../internal";

describe("InternalQuery", () => {
    it("accepts snapshot", () => {
        const instance = internalOf(new UnknownQuery(null));
        instance.applySnapshot("data", "v1");
        expect(instance.pub.tryBuildSnapshot()).toBe("data");
        expect(instance.version).toBe("v1");
    });

    it("accepts update", () => {
        // tslint:disable-next-line
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

    it("can be populated from a clone", async () => {
        const q1 = internalOf(new UnknownQuery(null));
        const q2 = internalOf(new UnknownQuery(null));
        const app = new App();
        const stop = autorun(() => {
            q1.reportObserved();
            q2.reportObserved();
        });

        q1.applySnapshot("hello world", "v1");
        q1.pub.attachTo(app);
        await when(() => !q1.isPopulating);

        q2.pub.attachTo(app);
        await when(() => !q2.isPopulating);

        expect(q2.pub.tryBuildSnapshot()).toBe("hello world");
        expect(q2.version).toBe("v1");
        expect(q2.isBroken).toBe(false);
    });

    it("cannot be populated from a clone that doesn't provide a snapshot", async () => {
        // tslint:disable-next-line
        class NoSnapshotQuery extends UnknownQuery {
            public tryBuildSnapshot() { return undefined; }
        }

        const q1 = internalOf(new NoSnapshotQuery(null));
        const q2 = internalOf(new UnknownQuery(null));
        const app = new App();
        const stop = autorun(() => {
            q1.reportObserved();
            q2.reportObserved();
        });

        q1.applySnapshot("hello world", "v1");
        q1.pub.attachTo(app);
        await when(() => !q1.isPopulating);

        app.console = SILENT_CONSOLE;
        q2.pub.attachTo(app);
        await when(() => !q2.isPopulating);

        expect(q2.pub.tryBuildSnapshot()).toBe(undefined);
        expect(q2.version).toBe(null);

        // Note: Since q2 could not be populated by cloning q1 we end up with two
        //       active same-key queries that do not agree on a common subscription
        //       contract (snapshot version differ). Therefore q2 is marked as broken.

        expect(q2.isBroken).toBe(true);

        // Resetting q2 will clear it's broken status, but it will become broken again
        // when a new attempt is made to populate it.

        // TODO: Enable this testing code
        // q2.pub.reset();
        // expect(q2.pub.isBroken).toBe(false);
        // await when(() => !q2.pub.isPopulating);
        // expect(q2.pub.isBroken).toBe(true);

        stop();
    });
});
