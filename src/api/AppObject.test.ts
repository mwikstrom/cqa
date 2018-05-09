import {
    AlreadyAttachedError,
    App,
    AppObject,
    NotAttachedError,
} from "../api";

describe("AppObject", () => {
    it("is not attached intially", () => {
        const obj = new AppObject();
        expect(obj.isAttached).toBe(false);
    });

    it("throws exception when trying to get app when not attached", () => {
        const obj = new AppObject();
        expect(() => obj.app).toThrowError(NotAttachedError);
    });

    it("can be attached to app", () => {
        const app = new App();
        const obj = new AppObject().attachTo(app);
        expect(obj.isAttached).toBe(true);
        expect(obj.app).toBe(app);
    });

    it("can be attached to the same app instance multiple times", () => {
        const app = new App();
        new AppObject().attachTo(app).attachTo(app);
    });

    it("cannot be attached to two different app instances", () => {
        const app1 = new App();
        const app2 = new App();
        const obj = new AppObject().attachTo(app1);
        expect(() => obj.attachTo(app2)).toThrowError(AlreadyAttachedError);
    });
});
