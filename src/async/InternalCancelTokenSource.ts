import { InternalOf } from "../utils/internal";
import { CancelToken } from "./CancelToken";
import { CancelTokenSource } from "./CancelTokenSource";
import { InternalCancelToken } from "./InternalCancelToken";

export class InternalCancelTokenSource extends InternalOf<CancelTokenSource> {
    private readonly _token = new InternalCancelToken();

    public get token(): CancelToken {
        return this._token.pub;
    }

    public cancel(): void {
        this._token.setCancelled();
    }
}
