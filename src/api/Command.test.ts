import {
    Command,
    UnknownCommand,
} from "../api";

describe("Command", () => {
    it("instances expose unique global identifiers", () => {
        const a = new UnknownCommand(null);
        const b = new UnknownCommand(null);

        expect(a.globalId).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(b.globalId).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(a.globalId).not.toBe(b.globalId);
    });
});
