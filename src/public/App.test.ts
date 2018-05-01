import { configure as confgiureMobx, reaction } from "mobx";

import { DEFAULT_REALM } from "../internal/Constants";

import { App } from "./App";
import { ConfigurationLockError } from "./ConfigurationLockError";
import { DisposeError } from "./DisposeError";

confgiureMobx({
    enforceActions: true,
});

describe("App", () => {
    it("can be constructed without arguments", () => {
        const app = new App();
        expect(app).toBeInstanceOf(App);
    });

    it("has the default realm by default", () => {
        const app = new App();
        expect(app.realm).toBe(DEFAULT_REALM);
    });

    it("can be configured with custom realm", () => {
        const app = new App();
        expect(app.configure({ realm: "My_Custom_Realm" })).toBe(app);
        expect(app.realm).toBe("My_Custom_Realm");
    });

    it("provides an observable dispose flag", () => {
        const app = new App();
        let reacted = false;

        reaction(
            () => app.isDisposed,
            () => reacted = true,
        );

        expect(app.isDisposed).toBe(false);
        expect(reacted).toBe(false);

        expect(app.dispose()).toBe(app);

        expect(app.isDisposed).toBe(true);
        expect(reacted).toBe(true);
    });

    it("provides an observable configuration lock flag", () => {
        const app = new App();
        let reacted = false;

        reaction(
            () => app.isConfigurationLocked,
            () => reacted = true,
        );

        expect(app.isConfigurationLocked).toBe(false);
        expect(reacted).toBe(false);

        expect(app.lockConfiguration()).toBe(app);

        expect(app.isConfigurationLocked).toBe(true);
        expect(reacted).toBe(true);
    });

    it("cannot be configured after lock", () => {
        const app = new App().lockConfiguration();
        expect(() => app.configure({})).toThrowError(ConfigurationLockError);
    });

    it("cannot be configured after dispose", () => {
        const app = new App().dispose();
        expect(() => app.configure({})).toThrowError(DisposeError);
    });
});
