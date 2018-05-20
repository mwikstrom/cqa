import {
    autorun,
    when,
} from "mobx";

import {
    App,
    Command,
    NotSupportedError,
    Query,
} from "../api";

import {
    internalOf,
} from "../internal";

describe("Query", () => {
    it("can be extended to fake support for incremental updates", () => {
        // tslint:disable-next-line
        class FakingQuery extends Query {
            public buildDescriptor() { return null; }
            public tryBuildSnapshot() { return null; }
            public onSnapshot() { /* no-op */ }
            public onReset() { /* no-op */ }
            public onUpdate() { /* no-op */ }
        }

        const instance = new FakingQuery();
        expect(instance.supportsIncrementalUpdates).toBe(true);
    });

    // tslint:disable-next-line
    class DummyCommand extends Command {
        public buildDescriptor() {
            return null;
        }
    }

    // tslint:disable-next-line
    class DummyQuery extends Query {
        public buildDescriptor() { return null; }
        public onSnapshot() { /* no-op */ }
        public onReset() { /* no-op */ }
    }

    it("throws when applying command", () => {
        const instance = new DummyQuery();
        expect(() => instance.onCommand(new DummyCommand())).toThrow(NotSupportedError);
    });

    it("throws when applying update", () => {
        const instance = new DummyQuery();
        expect(() => instance.onUpdate(null)).toThrow(NotSupportedError);
    });

    it("cannot build snapshot", () => {
        const instance = new DummyQuery();
        expect(instance.tryBuildSnapshot()).toBeUndefined();
    });

    it("is not affected by command", () => {
        const instance = new DummyQuery();
        expect(instance.mayAffectResult(new DummyCommand())).toBe(false);
    });

    it("has null version", () => {
        const instance = new DummyQuery();
        expect(instance.version).toBe(null);
    });

    it("is not broken", () => {
        const instance = new DummyQuery();
        expect(instance.isBroken).toBe(false);
    });

    it("it is automatically registered as active when attached", async () => {
        const instance = new DummyQuery();
        const app = new App();
        const stop = autorun(() => instance.reportObserved());

        const before = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(before.length).toBe(0);

        expect(instance.isPopulating).toBe(false);
        instance.attachTo(app);
        expect(instance.isPopulating).toBe(true);
        await when(() => !instance.isPopulating);

        const during = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(during.length).toBe(1);
        expect(during[0]).toBe(internalOf(instance));

        stop();

        const after = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(after.length).toBe(0);
    });

    it("it is automatically registered as active when observed", async () => {
        const instance = new DummyQuery();
        const app = new App();
        instance.attachTo(app);

        const before = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(before.length).toBe(0);

        expect(instance.isPopulating).toBe(false);
        const stop = autorun(() => instance.reportObserved());
        expect(instance.isPopulating).toBe(true);
        await when(() => !instance.isPopulating);

        const during = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(during.length).toBe(1);
        expect(during[0]).toBe(internalOf(instance));

        stop();

        const after = Array.from(internalOf(app).getActiveQueries(instance.key));
        expect(after.length).toBe(0);
    });
});
