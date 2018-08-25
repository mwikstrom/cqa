import { Dexie } from "dexie";

import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../json/create-json-crypto";
import { IJsonCrypto } from "../json/json-crypto";
import { LIB_NAME_SHORT } from "../utils/env";
import { openDatastore } from "./open-datastore";

describe("openDatastore", () => {
    let name: string;
    let crypto: IJsonCrypto;

    beforeEach(async () => {
        name = `test-${Math.floor(Math.random() * 9999999)}`;
        crypto = await createJsonCrypto();
    });

    it("can open a non-existing datastore", async () => {
        const store = await openDatastore({ name, crypto });
        store.close();
    });

    it("can re-open an existing datastore", async () => {
        const store1 = await openDatastore({ name, crypto });
        store1.close();

        const store2 = await openDatastore({ name, crypto });
        store2.close();
    });

    it("cannot open an invalid datastore", async () => {
        class InvalidDB extends Dexie {
            constructor(dbname: string) {
                super(dbname);
                this.version(1).stores({ dummy: "" });
            }
        }
        const db = new InvalidDB(`${LIB_NAME_SHORT}-datastore-${name}`);
        await db.open();
        db.close();
        await expect(openDatastore({ name, crypto })).rejects
            .toThrow(`'${name}' is not a valid ${LIB_NAME_SHORT} datastore`);
    });

    it("cannot open an existing datastore with incorrect crypto", async () => {
        const store1 = await openDatastore({ name, crypto });
        store1.close();

        const incorrect = await createJsonCrypto();
        await expect(openDatastore({ name, crypto: incorrect })).rejects
            .toThrow(`Incorrect crypto for ${LIB_NAME_SHORT} datastore '${name}'`);
    });
});
