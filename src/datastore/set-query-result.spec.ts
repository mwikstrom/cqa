import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

const expect = chai.expect;

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
        expect(await store.setQueryResult(query, "abc123", "hello world!")).to.eq(undefined);
    });

    it("can set result and overwriting previous", async () => {
        const query: IQueryDescriptor = { type: "x", param: null };
        expect(await store.setQueryResult(query, "abc123", "hello world!")).to.eq(undefined);
        expect(await store.setQueryResult(query, "abc456", "hello again!")).to.eq("abc123");
    });
});
