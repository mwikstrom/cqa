import { Dexie } from "dexie";
import "./fake";
import { openDatastore } from "./open";
import { IDatastore } from "./typings";

describe("Datastore", () => {
    const dbName = "test-datastore-" + Math.floor(Math.random() * 9999999);
    let db: IDatastore;

    beforeEach(async () => {
        db = await openDatastore(dbName);
    });

    afterEach(async () => {
        db.close();
        await Dexie.delete(dbName);
    });

    it("can store minimal command", async () => {
        const result = await db.addCommand({ target: "a", type: "minimal" });

        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.timestamp).toBeLessThanOrEqual(new Date().getTime());
        expect(result.payload).toBeUndefined();
        expect(result.target).toBe("a");
        expect(result.type).toBe("minimal");
    });

    it("can store command with payload", async () => {
        const result = await db.addCommand({ target: "b", type: "with-payload", payload: null });

        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.timestamp).toBeLessThanOrEqual(new Date().getTime());
        expect(result.payload).toBeNull();
        expect(result.target).toBe("b");
        expect(result.type).toBe("with-payload");
    });

    it("can store command with timestamp", async () => {
        const result = await db.addCommand({ target: "d", type: "with-timestamp", timestamp: 123 });

        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.timestamp).toBe(123);
        expect(result.payload).toBeUndefined();
        expect(result.target).toBe("d");
        expect(result.type).toBe("with-timestamp");
    });

    it("cannot store payload with unsupported value", async () => {
        // TODO: Path should be "payload". See https://github.com/gcanti/io-ts/issues/195
        const path = "payload/0";

        await expect(
            db.addCommand({ target: "e", type: "bad", payload: /bad/ as any }),
        ).rejects.toThrow(`Invalid command input. Expected json value in ${path}.`);
    });

    it("cannot store payload with nested unsupported value", async () => {
        // TODO: Path should be "payload/nested". See https://github.com/gcanti/io-ts/issues/195
        const path = "payload/0/nested";

        await expect(
            db.addCommand({ target: "e", type: "bad-nested", payload: { nested: /bad/ as any } }),
        ).rejects.toThrow(`Invalid command input. Expected json value in ${path}.`);
    });
});
