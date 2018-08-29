import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

describe("getQueryKey", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
        await store.addCommand({ target: "x", type: "y" });
    });

    afterEach(() => store.close());

    it("returns a 40 character long lower case hex string", () => {
        const descriptor: IQueryDescriptor = { type: "x" };
        const key = store.getQueryKey(descriptor);
        expect(key).toMatch(/^[0-9a-f]{40}$/);
    });

    it("returns the same result for the same descriptor", () => {
        const key1 = store.getQueryKey({ type: "x", param: { a: 1 }});
        const key2 = store.getQueryKey({ type: "x", param: { a: 1 }});
        expect(key1).toBe(key2);
    });

    it("returns the different results for the different descriptors", () => {
        const key1 = store.getQueryKey({ type: "x", param: { a: 1 }});
        const key2 = store.getQueryKey({ type: "x", param: { a: 2 }});
        const key3 = store.getQueryKey({ type: "y", param: { a: 1 }});
        expect(key1).not.toBe(key2);
        expect(key1).not.toBe(key3);
        expect(key2).not.toBe(key3);
    });
});
