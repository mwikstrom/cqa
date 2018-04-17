import { App } from "./App";
import { DEFAULT_REALM } from "./IAppOptions";

describe("App", () => {
    it("can be constructed without arguments", () => {
        const app = new App();
        expect(app).toBeInstanceOf(App);
    });

    it("can be initialized with default options", async () => {
        const app = new App();
        await app.initialize();
        expect(app.realm).toBe(DEFAULT_REALM);
    });

    it("can be initialized with custom realm", async () => {
        const app = new App();
        await app.initialize({ realm: "My Custom Realm"});
        expect(app.realm).toBe("My Custom Realm");
    });
});
