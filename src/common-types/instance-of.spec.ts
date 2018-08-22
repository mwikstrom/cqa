import { InstanceOf } from "./instance-of";

// tslint:disable:max-classes-per-file

describe("InstanceOf", () => {
    class A { constructor(_: number) { /* no-op */ } }
    class B extends A {}
    class C {}

    const TA = InstanceOf(A);
    const TB = InstanceOf(B);
    const TC = InstanceOf(C);

    const a = new A(123);
    const b = new B(456);
    const c = new C();

    it("exposes the expected name", () => {
        expect(TA.name).toBe("A");
        expect(TB.name).toBe("B");
        expect(TC.name).toBe("C");
    });

    it("can successfully decode an instance", () => {
        expect(TA.decode(a).isRight()).toBe(true);
        expect(TA.decode(b).isRight()).toBe(true);
        expect(TB.decode(b).isRight()).toBe(true);
        expect(TC.decode(c).isRight()).toBe(true);
    });

    it("cannot decode another instance", () => {
        expect(TA.decode(c).isRight()).toBe(false);
        expect(TB.decode(a).isRight()).toBe(false);
        expect(TB.decode(c).isRight()).toBe(false);
        expect(TC.decode(a).isRight()).toBe(false);
        expect(TC.decode(b).isRight()).toBe(false);
    });
});
