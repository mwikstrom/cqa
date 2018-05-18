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

    it("supports binding with cancellation", () => {
        const cts = new CancelTokenSource();
        const token = cts.token;
        class MyClass {
            public value = 0;
            public add(x: number, y: number, z: number) {
                this.value += x + y + z;
            }
        }
        const obj = new MyClass();
        const bound = token.bind(obj.add, obj);

        bound(1, 2, 3);
        expect(obj.value).toBe(6);

        cts.cancel();
        expect(() => bound(1, 2, 3)).toThrow(CancelError);
    });
});
