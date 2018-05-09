import {
    CancelError,
    CancelTokenSource,
} from "../api";

describe("CancelToken", () => {
    it("will throw when cancelled", () => {
        const cts = new CancelTokenSource();
        const token = cts.token;
        token.throwIfCancelled();
        cts.cancel();
        expect(() => token.throwIfCancelled()).toThrow(CancelError);
    });

    it("reject promise when cancelled", async () => {
        const cts = new CancelTokenSource();
        const token = cts.token;
        let rejectedWith = null;
        const promise = token.rejectWhenCancelled.catch(reason => rejectedWith = reason);
        cts.cancel();
        await promise;
        expect(token.isCancelled).toBe(true);
        expect(rejectedWith).not.toBeNull();
        expect(rejectedWith).toBeInstanceOf(CancelError);
    });

    it("can ignore cancellation", async () => {
        const cts = new CancelTokenSource();
        const token = cts.token;
        const callback = async () => {
            token.throwIfCancelled();
            return "resolved";
        };

        await expect(token.ignoreCancellation(callback(), "rejected")).resolves.toBe("resolved");
        cts.cancel();
        await expect(token.ignoreCancellation(callback(), "rejected")).resolves.toBe("rejected");
    });

    it("won't ignore cancel error unless token is cancelled", async () => {
        const cts = new CancelTokenSource();
        const token = cts.token;
        const callback = async () => {
            throw new CancelError();
        };
        await expect(token.ignoreCancellation(callback())).rejects.toThrow(CancelError);
    });
});
