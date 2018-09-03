import "../test-helpers/setup-fake-indexeddb";
import "../test-helpers/setup-text-encoding";
import "../test-helpers/setup-webcrypto";

import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";
import { IQueryDescriptor } from "../api/query-descriptor";

describe("purge", () => {
    let store: IDatastore;
    let now: Date;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        now = new Date();
        store = await openDatastore({ name, crypto, now: () => now });
    });

    afterEach(() => store.close());

    it("drops old queries", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "a", null);
        expect((await store.getQueryList()).length).toBe(1);
        now = new Date(now.getTime() + 60 * 60 * 1000); // one hour later
        await store.purge();
        expect((await store.getQueryList()).length).toBe(1); // not dropped
        now = new Date(now.getTime() + 1000); // but one more second later
        await store.purge();
        expect((await store.getQueryList()).length).toBe(0); // dropped!
    });

    it("drops old queries with custom retention period", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "a", null);
        expect((await store.getQueryList()).length).toBe(1);
        now = new Date(now.getTime() + 1000);
        await store.purge({ queryRetentionPeriod: 1000 });
        expect((await store.getQueryList()).length).toBe(1); // not dropped
        now = new Date(now.getTime() + 1);
        await store.purge({ queryRetentionPeriod: 1000 });
        expect((await store.getQueryList()).length).toBe(0); // dropped!
    });

    it("does not drop old and active queries", async () => {
        const query: IQueryDescriptor = { type: "x" };
        await store.setQueryResult(query, "a", null);
        expect((await store.getQueryList()).length).toBe(1);
        now = new Date(now.getTime() + 2 * 60 * 60 * 1000); // two hours later
        await store.purge({ activeQueries: [ query ]});
        expect((await store.getQueryList()).length).toBe(1); // not dropped (since it was active)
    });

    it("drops old rejected commands", async () => {
        const cmd = await store.addCommand({ type: "x", target: "y" });
        await store.setCommandRejected(cmd.key);
        expect((await store.getCommandList()).length).toBe(1);
        now = new Date(now.getTime() + 5 * 60 * 1000); // five minutes later
        await store.purge();
        expect((await store.getCommandList()).length).toBe(1); // not dropped
        now = new Date(now.getTime() + 1000); // but one more second later
        await store.purge();
        expect((await store.getCommandList()).length).toBe(0); // dropped!
    });

    it("drops old rejected commands with custom retention period", async () => {
        const cmd = await store.addCommand({ type: "x", target: "y" });
        await store.setCommandRejected(cmd.key);
        expect((await store.getCommandList()).length).toBe(1);
        now = new Date(now.getTime() + 1000);
        await store.purge({ commandRetentionPeriod: 1000 });
        expect((await store.getCommandList()).length).toBe(1); // not dropped
        now = new Date(now.getTime() + 1);
        await store.purge({ commandRetentionPeriod: 1000 });
        expect((await store.getCommandList()).length).toBe(0); // dropped!
    });

    it("does not drop pending commands", async () => {
        const cmd = await store.addCommand({ type: "x", target: "y" });
        expect((await store.getCommandList()).length).toBe(1);
        now = new Date(now.getTime() + 60 * 60 * 1000); // one hour later later
        await store.purge();
        expect((await store.getCommandList()).length).toBe(1); // not dropped
        await store.setCommandRejected(cmd.key);
        now = new Date(now.getTime() + 6 * 60 * 1000); // six minutes later
        await store.purge();
        expect((await store.getCommandList()).length).toBe(0); // dropped!
    });

    it("drops synced accepted commands", async () => {
        const query: IQueryDescriptor = { type: "x" };
        const cmd = await store.addCommand({ type: "x", target: "y" });
        await store.setCommandAccepted(cmd.key, "b");
        expect((await store.getCommandList()).length).toBe(1); // not dropped
        now = new Date(now.getTime() + 60 * 60 * 1000); // one hour later later
        await store.setQueryResult(query, "a", null);
        await store.purge();
        expect((await store.getCommandList()).length).toBe(1); // not dropped
        await store.updateQueryResult(query, { commitBefore: "a", commitAfter: "b" });
        await store.purge();
        expect((await store.getCommandList()).length).toBe(0); // dropped!
    });
});
