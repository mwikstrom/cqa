import { App } from "./App";
import { DEFAULT_REALM } from "./IAppOptions";

describe("App", () => {
    let app: App;

    beforeEach(() => {
        app = new App();
    });

    afterEach(async () => {
        await app.dispose();
    });

    it("can be initialized with default options", async () => {
        await app.initialize();
        expect(app.realm).toBe(DEFAULT_REALM);
    });

    it("can be initialized with custom realm", async () => {
        await app.initialize({ realm: "My Custom Realm" });
        expect(app.realm).toBe("My Custom Realm");
    });
});
