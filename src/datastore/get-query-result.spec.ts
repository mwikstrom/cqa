import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

const expect = chai.expect;

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
        expect(await store.getQueryResult(query)).to.eq(undefined);
    });

    it("result is changed when set", async () => {
        const query: IQueryDescriptor = { type: "x" };

        expect(await store.setQueryResult(query, "abc123", "hello world!"));
        const result1 = await store.getQueryResult(query);
        expect(result1).to.not.eq(undefined);
        expect(result1!.commit).to.eq("abc123");
        expect(result1!.data).to.eq("hello world!");

        expect(await store.setQueryResult(query, "abc456", "hello again!"));
        const result2 = await store.getQueryResult(query);
        expect(result2).to.not.eq(undefined);
        expect(result2!.commit).to.eq("abc456");
        expect(result2!.data).to.eq("hello again!");
    });
});
