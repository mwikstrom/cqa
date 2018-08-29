import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

describe("getQueryList", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("returns an empty list for a newly created store", async () => {
        const list = await store.getQueryList();
        expect(list.length).toBe(0);
    });

    it("returns the single added paramless query", async () => {
        await store.setQueryResult({ type: "x" }, "y", "z");
        const list = await store.getQueryList();
        expect(list.length).toBe(1);
        const data = list[0];
        expect(data.commit).toBe("y");
        expect(data.descriptor.param).toBeUndefined();
        expect(data.descriptor.type).toBe("x");
        expect(data.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });

    it("returns the single added query", async () => {
        await store.setQueryResult({ type: "x", param: { a: "b" } }, "y", "z");
        const list = await store.getQueryList({});
        expect(list.length).toBe(1);
        const data = list[0];
        expect(data.commit).toBe("y");
        expect(data.descriptor.param).toMatchObject({ a: "b" });
        expect(data.descriptor.type).toBe("x");
        expect(data.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });
});
