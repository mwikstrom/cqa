import { Dexie } from "dexie";
import "../test-helpers/setup-fake-indexeddb";

import { IDatastore } from "./datastore";
import { openDatastore } from "./open-datastore";

describe("Datastore", () => {
    let db: IDatastore;
    let name: string;

    beforeEach(async () => {
        name = `test-${Math.floor(Math.random() * 9999999)}`;
        db = await openDatastore({ name });
    });

    afterEach(async () => {
        db.close();
        await Dexie.delete(name);
    });

    it("can store minimal command", async () => {
        const result = await db.addCommand({ target: "a", type: "minimal" });

        expect(result.id).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.payload).toBeUndefined();
        expect(result.target).toBe("a");
        expect(result.type).toBe("minimal");
    });

    it("can store command with payload", async () => {
        const result = await db.addCommand({ target: "b", type: "with-payload", payload: null });

        expect(result.id).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.payload).toBeNull();
        expect(result.target).toBe("b");
        expect(result.type).toBe("with-payload");
    });

    it("can store command with id", async () => {
        const result = await db.addCommand({ target: "x", type: "with-id", id: "abc123" });

        expect(result.id).toBe("abc123");
        expect(result.key).toBeGreaterThanOrEqual(1);
        expect(result.payload).toBeUndefined();
        expect(result.target).toBe("x");
        expect(result.type).toBe("with-id");
    });

    it("cannot store command with duplicate id", async () => {
        await db.addCommand({ target: "x", type: "with-id", id: "abc123" });
        await expect(db.addCommand({ target: "x", type: "with-id", id: "abc123" })).rejects.toThrow();
    });

    it("cannot get command by non-existing key", async () => {
        expect(await db.getCommand(123)).toBeNull();
    });

    it("cannot get command by non-existing id", async () => {
        expect(await db.getCommand("abc")).toBeNull();
    });

    it("cannot get command by invalid key", async () => {
        expect(await db.getCommand(0)).toBeNull();
    });

    it("cannot get command by invalid id", async () => {
        expect(await db.getCommand("")).toBeNull();
    });

    it("can get stored command by id", async () => {
        const added = await db.addCommand({ target: "a", type: "b" });
        const fetched = await db.getCommand(added.id);
        expect(fetched).toEqual(added);
    });

    it("can get stored command by key", async () => {
        const added = await db.addCommand({ target: "a", type: "b" });
        const fetched = await db.getCommand(added.key);
        expect(fetched).toEqual(added);
    });

    it("cannot store payload with unsupported value", async () => {
        // TODO: Path should be "payload". See https://github.com/gcanti/io-ts/issues/195
        const path = "payload/0";

        expect(
            () => db.addCommand({ target: "e", type: "bad", payload: /bad/ as any }),
        ).toThrow(`Invalid command input. Expected json value in ${path}.`);
    });

    it("cannot store payload with nested unsupported value", async () => {
        // TODO: Path should be "payload/nested". See https://github.com/gcanti/io-ts/issues/195
        const path = "payload/0/nested";

        expect(
            () => db.addCommand({ target: "e", type: "bad-nested", payload: { nested: /bad/ as any } }),
        ).toThrow(`Invalid command input. Expected json value in ${path}.`);
    });

    it("can provide a list of pending commands", async () => {
        for (let i = 1; i <= 10; ++i) {
            const stored = await db.addCommand({ target: String(Math.floor(i / 3)), type: "test" });
            expect(stored.key).toBe(i);
        }

        const all = await db.getPendingCommands();
        expect(all.map(cmd => cmd.key)).toMatchObject([
            1, 3, 6, 9,
        ]);

        const filtered = await db.getPendingCommands({
            skipTarget: target => target === "2",
        });
        expect(filtered.map(cmd => cmd.key)).toMatchObject([
            1, 3, 9,
        ]);

        const capped = await db.getPendingCommands({
            maxTargets: 2,
            skipTarget: target => target === "0",
        });
        expect(capped.map(cmd => cmd.key)).toMatchObject([
            3, 6,
        ]);
    });
});
