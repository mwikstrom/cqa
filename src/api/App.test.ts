import {
    App,
    Command,
    Query,
    ReadonlyJsonValue,
    UnknownCommand,
    UnknownQuery,
} from "../api";

import {
    internalOf,
} from "../internal";

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
        expect(cmd.app).toBe(app);
    });

    it("will create unknown query instances by default", () => {
        const app = new App();
        const query = app.createQuery("hello world");
        expect(query).toBeInstanceOf(UnknownQuery);
        expect(query.descriptor).toBe("hello world");
        expect(query.key).toMatch(/^[0-9a-f]{40}$/);
        expect(query.app).toBe(app);
    });

    it("can be configured to create custom command instances", () => {
        const app = new App();
        // tslint:disable-next-line
        class CustomCommand extends Command {
            constructor(public descriptor: ReadonlyJsonValue) { super(); }
        }
        app.addCommandFactory(descriptor => new CustomCommand(descriptor));
        const cmd = app.createCommand("hello world");
        expect(cmd).toBeInstanceOf(CustomCommand);
        expect(cmd.descriptor).toBe("hello world");
        expect(cmd.app).toBe(app);
    });

    it("can be configured to create custom query instances", () => {
        const app = new App();
        // tslint:disable-next-line
        class CustomQuery extends Query {
            constructor(private _descriptor: ReadonlyJsonValue) { super(); }
            public buildDescriptor() { return this._descriptor; }
            public onSnapshot() { /* no-op */ }
        }
        app.addQueryFactory(descriptor => new CustomQuery(descriptor));
        const query = app.createQuery("hello world");
        expect(query).toBeInstanceOf(CustomQuery);
        expect(query.descriptor).toBe("hello world");
        expect(query.app).toBe(app);
    });

    it("verifies that the constructed query has the expected descriptor", () => {
        const app = new App();
        // tslint:disable-next-line
        class BadQuery extends Query {
            constructor(private _descriptor: ReadonlyJsonValue) { super(); }
            public buildDescriptor() { return "BAD"; }
            public onSnapshot() { /* no-op */ }
        }
        app.addQueryFactory(descriptor => new BadQuery(descriptor));
        expect(() => app.createQuery("GOOD")).toThrow("Constructed query has unexpected descriptor");
    });
});
