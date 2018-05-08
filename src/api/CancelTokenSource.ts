import { CancelToken } from "../api";

import {
    InternalCancelTokenSource,
    makeInternalOf,
} from "../internal";

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
