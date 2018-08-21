import * as t from "io-ts";
import { verify } from "./verify";

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
