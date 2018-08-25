import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../json/create-json-crypto";
import { IDatastore } from "./datastore";
import { openDatastore } from "./open-datastore";

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
        expect(list.length).toBe(0);
    });

    it("returns all commands in the order they were added", async () => {
        for (let i = 0; i < 5; ++i) {
            await store.addCommand({ target: String.fromCharCode(65 + i), type: "test" });
        }
        const list = await store.getCommandList();
        expect(list.map(data => data.target).join(",")).toBe("A,B,C,D,E");
    });
});
