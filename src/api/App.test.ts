import { configure as confgiureMobx, reaction } from "mobx";

import { App } from "../api";

confgiureMobx({
    enforceActions: true,
});

describe("App", () => {
    it("can be constructed without arguments", () => {
        const app = new App();
        expect(app).toBeInstanceOf(App);
    });
});
