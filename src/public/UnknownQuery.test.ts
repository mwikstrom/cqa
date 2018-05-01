import { UnknownQuery } from "./UnknownQuery";

describe("UnknownQuery", () => {
    it("does not support incremental updates", () => {
        const instance = new UnknownQuery(null, "");
        expect(instance.supportsIncrementalUpdates).toBe(false);
    });
});
