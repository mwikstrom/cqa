import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { JsonPatch } from "../api/json-patch";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";
import { IUpdateQueryOptions } from "../api/update-query-options";

const expect = chai.expect;

describe("updateQueryResult", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("cannot upgrade missing query", async () => {
        const query: IQueryDescriptor = { type: "x" };
        const options: IUpdateQueryOptions = { commitBefore: "a", commitAfter: "b" };
        await store.updateQueryResult(query, options).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Cannot update missing query"),
        );
    });

    it("cannot patch missing query", async () => {
        const query: IQueryDescriptor = { type: "x" };
        const options: IUpdateQueryOptions = { commitBefore: "a", commitAfter: "b", patch: [] };
        await store.updateQueryResult(query, options).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Cannot update missing query"),
        );
    });

    it("cannot upgrade conflicting commit version", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "x", null);
        const options: IUpdateQueryOptions = { commitBefore: "a", commitAfter: "b" };
        await store.updateQueryResult(query, options).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Commit version conflict"),
        );
    });

    it("can upgrade query result", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "a", { a: 1, b: 2 });
        const options: IUpdateQueryOptions = { commitBefore: "a", commitAfter: "b" };
        await store.updateQueryResult(query, options);
        const result = await store.getQueryResult(query);
        expect(result).to.not.eq(undefined);
        expect(result!.commit).to.eq("b");
        expect(result!.data).to.deep.eq({ a: 1, b: 2 });
    });

    it("can patch query result", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "a", { a: 1, b: 2 });
        const patch: JsonPatch = [{ op: "add", path: "/b", value: 3}];
        const options: IUpdateQueryOptions = { commitBefore: "a", commitAfter: "b", patch };
        await store.updateQueryResult(query, options);
        const result = await store.getQueryResult(query);
        expect(result).to.not.eq(undefined);
        expect(result!.commit).to.eq("b");
        expect(result!.data).to.deep.eq({ a: 1, b: 3 });
    });
});
