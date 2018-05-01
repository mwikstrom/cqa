import { CancelToken } from "../public/CancelToken";
import { CancelTokenSource } from "../public/CancelTokenSource";

import { InternalCancelToken } from "../internal/InternalCancelToken";
import { InternalOf } from "../internal/InternalOf";

export class InternalCancelTokenSource extends InternalOf<CancelTokenSource> {
    private readonly _token = new InternalCancelToken();

    public get token(): CancelToken {
        return this._token.pub;
    }

    public cancel(): void {
        this._token.setCancelled();
    }
}
