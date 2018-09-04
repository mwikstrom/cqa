import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

const expect = chai.expect;

describe("getQueryList", () => {
    let store: IDatastore;
    let now: Date;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        now = new Date();
        store = await openDatastore({ name, crypto, now: () => now });
    });

    afterEach(() => store.close());

    it("returns an empty list for a newly created store", async () => {
        const list = await store.getQueryList();
        expect(list.length).to.eq(0);
    });

    it("returns the single added paramless query", async () => {
        await store.setQueryResult({ type: "x" }, "y", null);
        const list = await store.getQueryList();
        expect(list.length).to.eq(1);
        const data = list[0];
        expect(data.commit).to.eq("y");
        expect(data.descriptor.param).to.eq(undefined);
        expect(data.descriptor.type).to.eq("x");
        expect(data.timestamp.getTime()).to.eq(now.getTime());
    });

    it("returns the single added query", async () => {
        await store.setQueryResult({ type: "x", param: { a: "b" } }, "y", null);
        const list = await store.getQueryList({});
        expect(list.length).to.eq(1);
        const data = list[0];
        expect(data.commit).to.eq("y");
        expect(data.descriptor.param).to.deep.eq({ a: "b" });
        expect(data.descriptor.type).to.eq("x");
        expect(data.timestamp.getTime()).to.eq(now.getTime());
    });

    it("returns the matching query using type filter", async () => {
        await store.setQueryResult({ type: "x" }, "y", null);
        await store.setQueryResult({ type: "z" }, "y", null);
        const list = await store.getQueryList({ type: "x" });
        expect(list.length).to.eq(1);
        const data = list[0];
        expect(data.commit).to.eq("y");
        expect(data.descriptor.param).to.eq(undefined);
        expect(data.descriptor.type).to.eq("x");
        expect(data.timestamp.getTime()).to.eq(now.getTime());
    });

    it("returns the matching query using type and param filter", async () => {
        for (let i = 0; i < 20; ++i) {
            await store.setQueryResult(
                {
                    param: {
                        x: String(i % 3),
                        y: String(i),
                    },
                    type: String(i % 2),
                },
                String(i),
                null,
            );
        }

        const list = (await store.getQueryList({ type: "0", param: { x: "0" } })).map(r => r.commit);
        expect(list).to.contain("0");
        expect(list).to.contain("6");
        expect(list).to.contain("12");
        expect(list).to.contain("18");
        expect(list.length).to.eq(4);
    });
});
