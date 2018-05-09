import { CancelToken } from "../api";

import { internalOf } from "../internal";

export class CancelTokenSource {
    public get token(): CancelToken {
        return internalOf(this).token;
    }

    public cancel(): this {
        internalOf(this).cancel();
        return this;
    }
}
