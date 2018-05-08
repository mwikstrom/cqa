import {
    CancelToken,
    CancelTokenSource,
} from "../api";

import {
    InternalCancelToken,
    InternalOf,
} from "../internal";

export class InternalCancelTokenSource extends InternalOf<CancelTokenSource> {
    private readonly _token = new InternalCancelToken();

    public get token(): CancelToken {
        return this._token.pub;
    }

    public cancel(): void {
        this._token.setCancelled();
    }
}
