import { Dexie } from "dexie";

import { LIB_NAME_SHORT } from "../utils/env";
import { createJsonCrypto } from "./create-json-crypto";
import { IJsonCrypto } from "./json-crypto";
import { openDatastore } from "./open-datastore";

const expect = chai.expect;

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
        const invalid = new InvalidDB(`${LIB_NAME_SHORT}-datastore-${name}`);
        await invalid.open();
        invalid.close();
        await openDatastore({ name, crypto }).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq(`'${name}' is not a valid ${LIB_NAME_SHORT} datastore`),
        );
    });

    it("cannot re-open datastore with other crypto", async () => {
        const store = await openDatastore({ name, crypto });
        store.close();

        const other = await createJsonCrypto();
        await openDatastore({ name, crypto: other }).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq(`Incorrect crypto for ${LIB_NAME_SHORT} datastore '${name}'`),
        );
    });

    it("mastership is transferred when original master is closed", async () => {
        const store1 = await openDatastore({ name, crypto });
        const store2 = await openDatastore({ name, crypto });

        expect(store1.isMaster).to.be.eq(true);
        expect(store2.isMaster).to.be.eq(false);

        store1.close();

        expect(store1.isMaster).to.be.eq(false);
        expect(store2.isMaster).to.be.eq(false);

        await store2.whenMaster;
        expect(store2.isMaster).to.be.eq(true);

        store2.close();
    });
});
