import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

describe("getQueryResult", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("result is undefined for an unknown query", async () => {
        const query: IQueryDescriptor = { type: "x" };
        expect(await store.getQueryResult(query)).toBeUndefined();
    });

    it("result is changed when set", async () => {
        const query: IQueryDescriptor = { type: "x" };

        expect(await store.setQueryResult(query, "abc123", "hello world!"));
        const result1 = await store.getQueryResult(query);
        expect(result1).toBeDefined();
        expect(result1!.commit).toBe("abc123");
        expect(result1!.data).toBe("hello world!");
        expect(result1!.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());

        expect(await store.setQueryResult(query, "abc456", "hello again!"));
        const result2 = await store.getQueryResult(query);
        expect(result2).toBeDefined();
        expect(result2!.commit).toBe("abc456");
        expect(result2!.data).toBe("hello again!");
        expect(result2!.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });
});
