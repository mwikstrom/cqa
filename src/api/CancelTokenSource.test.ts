import {
    CancelToken,
    CancelTokenSource,
} from "../api";

describe("CancelTokenSource", () => {
    it("token is intitially not cancelled", () => {
        const cts = new CancelTokenSource();
        expect(cts.token.isCancelled).toBe(false);
    });

    it("token can be cancelled", () => {
        const cts = new CancelTokenSource().cancel();
        expect(cts.token.isCancelled).toBe(true);
    });
});
