import { observable, runInAction } from "mobx";

import {
    CancelToken,
    CancelTokenSource,
} from "../api";

describe("CancelTokenSource", () => {
    it("is intitially not cancelled", () => {
        const cts = new CancelTokenSource();
        expect(cts.token.isCancelled).toBe(false);
    });

    it("can be cancelled", () => {
        const cts = new CancelTokenSource().cancel();
        expect(cts.token.isCancelled).toBe(true);
    });

    it("can be cancelled by reaction", () => {
        const value = observable.box(false);
        const cts = new CancelTokenSource();
        cts.cancelWhen(() => value.get());
        expect(cts.token.isCancelled).toBe(false);
        runInAction(() => value.set(true));
        expect(cts.token.isCancelled).toBe(true);
    });

    it("cancellation reaction can be aborted", () => {
        const value = observable.box(false);
        const cts = new CancelTokenSource();
        const abort = cts.cancelWhen(() => value.get());
        expect(cts.token.isCancelled).toBe(false);
        abort();
        runInAction(() => value.set(true));
        expect(cts.token.isCancelled).toBe(false);
    });
});
