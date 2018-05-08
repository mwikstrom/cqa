import { Query } from "../api";

describe("Query", () => {
    it("can be extended to fake support for incremental updates", () => {
        class FakingQuery extends Query {
            public buildDescriptor() { return null; }
            public tryBuildSnapshot() { return null; }
            public onSnapshot() { /* no-op */ }
            public onUpdate() { /* no-op */ }
        }

        const instance = new FakingQuery();
        expect(instance.supportsIncrementalUpdates).toBe(true);
    });
});
