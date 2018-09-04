import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

const expect = chai.expect;

describe("getCommandList", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("returns an empty list for a newly created store", async () => {
        const list = await store.getCommandList();
        expect(list.length).to.eq(0);
    });

    it("returns all commands in the order they were added", async () => {
        for (let i = 0; i < 5; ++i) {
            await store.addCommand({ target: String.fromCharCode(65 + i), type: "test" });
        }
        const list = await store.getCommandList();
        expect(list.map(data => data.target).join(",")).to.eq("A,B,C,D,E");
    });
});
