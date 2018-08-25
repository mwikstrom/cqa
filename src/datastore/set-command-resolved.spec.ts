import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

describe("setCommandResolved", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
        await store.addCommand({ target: "x", type: "y" });
    });

    afterEach(() => store.close());

    it("can mark pending command as accepted", async () => {
        await store.setCommandAccepted(1, "abc123");
        const list = await store.getCommandList();
        expect(list.map(data => data.result).join()).toBe("accepted");
    });

    it("can mark pending command as rejected", async () => {
        await store.setCommandRejected(1);
        const list = await store.getCommandList();
        expect(list.map(data => data.result).join()).toBe("rejected");
    });

    it("can re-mark accepted command with same commit", async () => {
        expect(await store.setCommandAccepted(1, "abc123")).toBe(true);
        expect(await store.setCommandAccepted(1, "abc123")).toBe(false);
    });

    it("can re-mark rejected command", async () => {
        expect(await store.setCommandRejected(1)).toBe(true);
        expect(await store.setCommandRejected(1)).toBe(false);
    });

    it("cannot mark accepted command with other commit", async () => {
        await store.setCommandAccepted(1, "abc123");
        await expect(store.setCommandAccepted(1, "other")).rejects
            .toThrow("Command 1 is already accepted in another commit");
    });

    it("cannot mark accepted command as rejected", async () => {
        await store.setCommandAccepted(1, "abc123");
        await expect(store.setCommandRejected(1)).rejects
            .toThrow("Command 1 is accepted and cannot be rejected");
    });

    it("cannot mark rejected command as accepted", async () => {
        await store.setCommandRejected(1);
        await expect(store.setCommandAccepted(1, "abc123")).rejects
            .toThrow("Command 1 is rejected and cannot be accepted");
    });

    it("cannot mark non-existing command as rejected", async () => {
        await expect(store.setCommandRejected(123)).rejects
            .toThrow("Unknown command 123 cannot be rejected");
    });

    it("cannot mark non-existing command as accepted", async () => {
        await expect(store.setCommandAccepted(123, "abc123")).rejects
            .toThrow("Unknown command 123 cannot be accepted");
    });
});
