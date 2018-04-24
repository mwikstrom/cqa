import { makeInternalOf } from "../utils/internal";
import { CancelToken } from "./CancelToken";
import { InternalCancelTokenSource } from "./InternalCancelTokenSource";

export class CancelTokenSource {
    public get token(): CancelToken {
        return internalOf(this).token;
    }

    public cancel(): void {
        internalOf(this).cancel();
    }
}

const internalOf = makeInternalOf<CancelTokenSource, InternalCancelTokenSource>(
    CancelTokenSource,
    InternalCancelTokenSource,
);
