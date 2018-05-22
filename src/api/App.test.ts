import {
    autorun,
    when,
} from "mobx";

import {
    App,
    Command,
    Query,
    ReadonlyJsonValue,
    UnknownCommand,
    UnknownQuery,
} from "../api";

import {
    internalOf, LIB_NAME_SHORT,
} from "../internal";

describe("App", () => {
    it("can be constructed without arguments", () => {
        const app = new App();
        expect(app).toBeInstanceOf(App);
    });

    it("instances expose unique identifiers", () => {
        const a = new App();
        const b = new App();

        expect(a.instanceId).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(b.instanceId).toMatch(/^[0-9a-zA-Z_-]{22}$/);
        expect(a.instanceId).not.toBe(b.instanceId);
    });

    it("has the expected default local realm", () => {
        const app = new App();
        expect(app.localRealm).toBe(LIB_NAME_SHORT);
    });

    it("can be initialized with custom local realm", () => {
        const app = new App({ localRealm: "test-123" });
        expect(app.localRealm).toBe("test-123");
    });

    it("can be assigned a new local realm value after creation", () => {
        const app = new App();
        app.configure({ localRealm: "test-123" });
        expect(app.localRealm).toBe("test-123");
    });

    it("can be assigned a new local realm value after creation", () => {
        const app = new App().configure({ localRealm: "test-123" });
        expect(app.localRealm).toBe("test-123");
    });

    it("can be configured without changing local realm", () => {
        const app = new App({ localRealm: "test-123" });
        app.configure({});
        expect(app.localRealm).toBe("test-123");
    });

    it("cannot be assigned an invalid local realm value", () => {
        const app = new App();
        expect(() => app.configure({ localRealm: "B A D" })).toThrow("Invalid local realm value: B A D");
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
        expect(query.key).toMatch(/^[0-9a-zA-Z_-]{27}$/);
        expect(query.app).toBe(app);
    });

    it("can be configured to create custom command instances", () => {
        const app = new App();
        // tslint:disable-next-line
        class CustomCommand extends UnknownCommand {}
        app.addCommandFactory(_ => undefined); // shall be ignored
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
            public onReset() { /* no-op */ }
        }
        app.addQueryFactory(_ => undefined); // shall be ignored
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
            public onReset() { /* no-op */ }
        }
        app.addQueryFactory(descriptor => new BadQuery(descriptor));
        expect(() => app.createQuery("GOOD")).toThrow("Constructed query has unexpected descriptor");
    });

    describe("execute", () => {
        it("accepts descriptor and returns attached command instance", () => {
            const descriptor = "test";
            const app = new App();
            const cmd = app.execute(descriptor);
            expect(cmd.isAttached).toBe(true);
            expect(cmd.app).toBe(app);
        });

        it("accepts unattached command and returns it after attaching", () => {
            const cmd = new UnknownCommand("test");
            const app = new App();
            const ret = app.execute(cmd);
            expect(cmd.isAttached).toBe(true);
            expect(cmd.app).toBe(app);
            expect(ret).toBe(cmd);
        });
    });

    it("supports multiple active same-key query instances", async () => {
        const app = new App();
        const q1 = app.createQuery("test");
        const q2 = app.createQuery("test");
        const stop1 = autorun(() => q1.reportObserved());
        const stop2 = autorun(() => q2.reportObserved());
        await Promise.all([
            when(() => !q1.isPopulating),
            when(() => !q2.isPopulating),
        ]);
        stop1();
        stop2();
    });
});
