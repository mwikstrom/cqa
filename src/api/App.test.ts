import {
    App,
    UnknownCommand,
    UnknownQuery,
} from "../api";

describe("App", () => {
    it("can be constructed without arguments", () => {
        const app = new App();
        expect(app).toBeInstanceOf(App);
    });

    it("will create unknown command instances by default", () => {
        const app = new App();
        const cmd = app.createCommand("hello world");
        expect(cmd).toBeInstanceOf(UnknownCommand);
        expect(cmd.descriptor).toBe("hello world");
    });

    it("will create unknown query instances by default", () => {
        const app = new App();
        const cmd = app.createQuery("hello world");
        expect(cmd).toBeInstanceOf(UnknownQuery);
        expect(cmd.descriptor).toBe("hello world");
        expect(cmd.key).toMatch(/^[0-9a-f]{40}$/);
    });
});
