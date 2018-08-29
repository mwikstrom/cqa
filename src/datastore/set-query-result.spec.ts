import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

describe("setQueryResult", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("can set result for previously unknown query", async () => {
        const query: IQueryDescriptor = { type: "x" };
        expect(await store.setQueryResult(query, "abc123", "hello world!")).toBeUndefined();
    });

    it("can set result and overwriting previous", async () => {
        const query: IQueryDescriptor = { type: "x", param: null };
        expect(await store.setQueryResult(query, "abc123", "hello world!")).toBeUndefined();
        expect(await store.setQueryResult(query, "abc456", "hello again!")).toBe("abc123");
    });
});
