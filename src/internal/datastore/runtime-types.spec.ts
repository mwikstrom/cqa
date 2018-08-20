import { isValidStatusAndCommit } from "./runtime-types";

describe("isValidStatusAndCommit", () => {
    describe("pending", () => {
        it("is valid for undefined commit", () => {
            expect(isValidStatusAndCommit("pending", undefined)).toBe(true);
        });

        it("is not valid for empty commit", () => {
            expect(isValidStatusAndCommit("pending", "")).toBe(false);
        });

        it("is not valid for non-empty commit", () => {
            expect(isValidStatusAndCommit("pending", "abc123")).toBe(false);
        });
    });

    describe("accepted", () => {
        it("is not valid for undefined commit", () => {
            expect(isValidStatusAndCommit("accepted", undefined)).toBe(false);
        });

        it("is not valid for empty commit", () => {
            expect(isValidStatusAndCommit("accepted", "")).toBe(false);
        });

        it("is valid for non-empty commit", () => {
            expect(isValidStatusAndCommit("accepted", "abc123")).toBe(true);
        });
    });

    describe("rejected", () => {
        it("is valid for undefined commit", () => {
            expect(isValidStatusAndCommit("rejected", undefined)).toBe(true);
        });

        it("is not valid for empty commit", () => {
            expect(isValidStatusAndCommit("rejected", "")).toBe(false);
        });

        it("is not valid for non-empty commit", () => {
            expect(isValidStatusAndCommit("rejected", "abc123")).toBe(false);
        });
    });

    describe("other", () => {
        it("is not valid for undefined commit", () => {
            expect(isValidStatusAndCommit("other", undefined)).toBe(false);
        });

        it("is not valid for empty commit", () => {
            expect(isValidStatusAndCommit("other", "")).toBe(false);
        });

        it("is not valid for non-empty commit", () => {
            expect(isValidStatusAndCommit("other", "abc123")).toBe(false);
        });
    });
});
