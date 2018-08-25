import * as t from "io-ts";
import { unwrapVerifications, verify, withVerification } from "./verify";

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
            fail();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            const expected = "Invalid value. Unexpected b/x. Expected \"foo\" in e. Expected number in f/1.";
            expect((error as Error).message).toBe(expected);
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

        expect(unwrapped.x).toBe(rawX);
        expect(unwrapped.y).toBe(rawY);
        expect(unwrapped.z).toBe(obj.z);

        expect(countX).toBe(0);
        expect(countY).toBe(0);

        expect(unwrapped.x()).toBe("x");
        expect(unwrapped.y()).toBe("y");

        expect(countX).toBe(0);
        expect(countY).toBe(0);

        expect(obj.x()).toBe("x");
        expect(obj.y()).toBe("y");

        expect(countX).toBe(1);
        expect(countY).toBe(1);
    });

    it("returns same instance when nothing is unwrapped", () => {
        const obj = { x: 123 };
        const result = unwrapVerifications(obj);
        expect(result).toBe(obj);
    });
});
