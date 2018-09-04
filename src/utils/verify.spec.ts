import * as t from "io-ts";
import { unwrapVerifications, verify, withVerification } from "./verify";

const expect = chai.expect;

describe("verify", () => {
    it("throws an error with the expected details", () => {
        try {
            verify(
                "value",
                { a: "ok", b: { c: 0, d: true, x: null }, e: "bar", f: [ 0, false, 1 ] } as any,
                t.interface({
                    a: t.string,
                    b: t.exact(t.interface({ c: t.number, d: t.boolean })),
                    e: t.literal("foo"),
                    f: t.array(t.number),
                }),
            );
            chai.assert.fail();
        } catch (error) {
            expect(error).to.be.instanceof(Error);
            const expected = "Invalid value. Unexpected b/x. Expected \"foo\" in e. Expected number in f/1.";
            expect((error as Error).message).to.eq(expected);
        }
    });
});

describe("unwrapVerifications", () => {
    it("unwraps verified members", () => {
        const rawX = () => "x";
        const rawY = () => "y";
        let countX = 0;
        let countY = 0;
        const x = withVerification(rawX, () => ++countX);
        const y = withVerification(rawY, () => ++countY);
        const z = 123;
        const obj = { x, y, z };
        const unwrapped = unwrapVerifications(obj);

        expect(unwrapped.x).to.eq(rawX);
        expect(unwrapped.y).to.eq(rawY);
        expect(unwrapped.z).to.eq(obj.z);

        expect(countX).to.eq(0);
        expect(countY).to.eq(0);

        expect(unwrapped.x()).to.eq("x");
        expect(unwrapped.y()).to.eq("y");

        expect(countX).to.eq(0);
        expect(countY).to.eq(0);

        expect(obj.x()).to.eq("x");
        expect(obj.y()).to.eq("y");

        expect(countX).to.eq(1);
        expect(countY).to.eq(1);
    });

    it("returns same instance when nothing is unwrapped", () => {
        const obj = { x: 123 };
        const result = unwrapVerifications(obj);
        expect(result).to.eq(obj);
    });
});
