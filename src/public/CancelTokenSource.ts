import { InternalCancelTokenSource } from "../internal/InternalCancelTokenSource";
import { makeInternalOf } from "../internal/InternalOf";

import { CancelToken } from "./CancelToken";

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
