import { ICommandData } from "../api/command-data";
import { createJsonCrypto } from "../api/create-json-crypto";
import { IJsonCrypto } from "../api/json-crypto";
import { openDatastore } from "../api/open-datastore";

const expect = chai.expect;

describe("setupCommandListener", () => {
    let name: string;
    let crypto: IJsonCrypto;

    beforeEach(async () => {
        name = `test-${Math.floor(Math.random() * 9999999)}`;
        crypto = await createJsonCrypto();
    });

    it("can listen to added command from other store", async () => {
        const store1 = await openDatastore({ name, crypto });

        let added;
        const promise = new Promise<ICommandData>(resolve => added = resolve);
        await openDatastore({ name, crypto, on: { command: { added }} });
        await store1.addCommand({ type: "x", target: "y" });

        const data = await promise;
        expect(data.key).to.be.eq(1);
        expect(data.type).to.be.eq("x");
        expect(data.target).to.be.eq("y");
    });

    it("can listen to rejected command from other store", async () => {
        const store1 = await openDatastore({ name, crypto });

        let rejected;
        const promise = new Promise<ICommandData>(resolve => rejected = resolve);
        const store2 = await openDatastore({ name, crypto, on: { command: { rejected }} });
        const { key } = await store2.addCommand({ type: "x", target: "y" });
        await store1.setCommandRejected(key);

        const result = await promise;
        expect(result).to.be.eq(key);
    });

    it("can listen to accepted command from other store", async () => {
        const store1 = await openDatastore({ name, crypto });

        let accepted;
        const promise = new Promise<ICommandData>(resolve => accepted = resolve);
        const store2 = await openDatastore({ name, crypto, on: { command: { accepted }} });
        const { key } = await store2.addCommand({ type: "x", target: "y" });
        await store1.setCommandAccepted(key, "a");

        const result = await promise;
        expect(result).to.be.eq(key);
    });

    it("can listen to purged command from other store", async () => {
        let now = new Date();
        const store1 = await openDatastore({ name, crypto, now: () => now });

        let purged;
        const promise = new Promise<ICommandData>(resolve => purged = resolve);
        const store2 = await openDatastore({ name, crypto, on: { command: { purged } }, now: () => now });
        const { key } = await store2.addCommand({ type: "x", target: "y" });
        await store2.setCommandRejected(key);

        now = new Date(now.getTime() + 24 * 60 * 60 * 1000); // one day later
        await store1.purge();

        const result = await promise;
        expect(result).to.be.eq(key);
    });
});
