// tslint:disable:max-classes-per-file

import { InstanceOf } from "./instance-of";

const expect = chai.expect;

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
        expect(TA.name).to.eq("A");
        expect(TB.name).to.eq("B");
        expect(TC.name).to.eq("C");
    });

    it("can successfully decode an instance", () => {
        expect(TA.decode(a).isRight()).to.eq(true);
        expect(TA.decode(b).isRight()).to.eq(true);
        expect(TB.decode(b).isRight()).to.eq(true);
        expect(TC.decode(c).isRight()).to.eq(true);
    });

    it("cannot decode another instance", () => {
        expect(TA.decode(c).isRight()).to.eq(false);
        expect(TB.decode(a).isRight()).to.eq(false);
        expect(TB.decode(c).isRight()).to.eq(false);
        expect(TC.decode(a).isRight()).to.eq(false);
        expect(TC.decode(b).isRight()).to.eq(false);
    });
});
