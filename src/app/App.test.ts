import { reaction } from "mobx";

import { App } from "./App";
import { AppState } from "./AppState";
import { DEFAULT_REALM } from "./IAppOptions";

describe("App", () => {
    it("can be initialized with default options", async () => {
        const app = await new App().initialize();
        expect(app.realm).toBe(DEFAULT_REALM);
        await app.dispose();
    });

    it("can be initialized with custom realm", async () => {
        const app = await new App().initialize({ realm: "My Custom Realm" });
        expect(app.realm).toBe("My Custom Realm");
        await app.dispose();
    });

    it("report all life cycle states", async () => {
        const app = await new App();
        const captured = [app.state];

        reaction(
            () => app.state,
            state => captured.push(state),
        );

        await app.initialize();
        await app.dispose();

        expect(captured.length).toBe(5);
        expect(captured[0]).toBe(AppState.Uninitialized);
        expect(captured[1]).toBe(AppState.Initializing);
        expect(captured[2]).toBe(AppState.Initialized);
        expect(captured[3]).toBe(AppState.Disposing);
        expect(captured[4]).toBe(AppState.Disposed);
    });
});
