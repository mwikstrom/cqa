import {
    App,
    Query,
    ReadonlyJsonValue,
} from "../api";

import {
    internalOf,
} from "../internal";

describe("App", () => {
    it("verifies that the constructed query has the expected key", () => {
        const app = internalOf(new App());
        // tslint:disable-next-line
        class BadQuery extends Query {
            constructor(private _descriptor: ReadonlyJsonValue) { super(); }
            public buildDescriptor() { return this._descriptor; }
            public buildKey() { return "BAD"; }
            public onSnapshot() { /* no-op */ }
        }
        app.addQueryFactory(descriptor => new BadQuery(descriptor));
        expect(() => app.createQuery("GOOD", "GOOD")).toThrow("Constructed query has unexpected key");
    });
});
