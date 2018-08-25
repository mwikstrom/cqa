import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { ICommandInput } from "../api/command-input";
import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

describe("addCommand", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("can be invoked with minimal input", async () => {
        const input: ICommandInput = {
            target: "x",
            type: "y",
        };

        const data = await store.addCommand(input);

        expect(data.commit).toBe("");
        expect(data.id).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(data.key).toBe(1);
        expect(data.payload).toBe(null);
        expect(data.result).toBe("pending");
        expect(data.target).toBe(input.target);
        expect(data.type).toBe(input.type);
    });

    it("can be invoked with full input", async () => {
        const payload = { hello: "world" };
        const input: ICommandInput = {
            id: "a",
            payload,
            target: "x",
            type: "y",
        };

        const data = await store.addCommand(input);

        expect(data.commit).toBe("");
        expect(data.id).toBe(input.id);
        expect(data.key).toBe(1);
        expect(data.payload).toMatchObject(payload);
        expect(data.result).toBe("pending");
        expect(data.target).toBe(input.target);
        expect(data.type).toBe(input.type);
    });
});
