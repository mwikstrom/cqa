import {
    Command,
    UnknownCommand,
} from "../api";

describe("Command", () => {
    it("instances expose unique identifiers", () => {
        const a = new UnknownCommand(null);
        const b = new UnknownCommand(null);

        expect(a.id).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(b.id).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(a.id).not.toBe(b.id);
    });
});
