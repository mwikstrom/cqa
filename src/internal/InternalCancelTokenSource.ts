import {
    CancelToken,
    CancelTokenSource,
} from "../api";

import {
    InternalBase,
    InternalCancelToken,
} from "../internal";

export class InternalCancelTokenSource extends InternalBase<CancelTokenSource> {
    private readonly _token = new InternalCancelToken();

    public get token(): CancelToken {
        return this._token.pub;
    }

    public cancel(): void {
        this._token.setCancelled();
    }
}
