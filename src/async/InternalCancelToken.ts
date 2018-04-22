import { observable } from "mobx";

import { InternalOf } from "../utils/internal";
import { CancelToken } from "./CancelToken";

export class InternalCancelToken extends InternalOf<CancelToken> {
    @observable
    private _isCancelled = false;

    constructor(pub: CancelToken = new CancelToken()) {
        super(pub);
    }

    public get isCancelled(): boolean {
        return this._isCancelled;
    }

    public setCancelled(): void {
        this._isCancelled = true;
    }
}
