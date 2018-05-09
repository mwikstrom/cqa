import {
    CancelToken,
    CancelTokenSource,
} from "../api";

import {
    InternalBase,
    internalOf,
} from "../internal";

export class InternalCancelTokenSource extends InternalBase<CancelTokenSource> {
    private readonly _token = new CancelToken();

    public get token(): CancelToken {
        return this._token;
    }

    public cancel(): void {
        internalOf(this._token).setCancelled();
    }
}
