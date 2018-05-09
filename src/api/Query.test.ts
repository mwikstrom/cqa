import {
    Command,
    NotSupportedError,
    Query,
} from "../api";

describe("Query", () => {
    it("can be extended to fake support for incremental updates", () => {
        // tslint:disable-next-line
        class FakingQuery extends Query {
            public buildDescriptor() { return null; }
            public tryBuildSnapshot() { return null; }
            public onSnapshot() { /* no-op */ }
            public onUpdate() { /* no-op */ }
        }

        const instance = new FakingQuery();
        expect(instance.supportsIncrementalUpdates).toBe(true);
    });

    // tslint:disable-next-line
    class DummyCommand extends Command {
        public readonly descriptor = null;
    }

    // tslint:disable-next-line
    class DummyQuery extends Query {
        public buildDescriptor() { return null; }
        public onSnapshot() { /* no-op */ }
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
});
