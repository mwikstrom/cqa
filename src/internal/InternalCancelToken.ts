import { observable } from "mobx";

import { CancelToken } from "../api";

import { InternalOf } from "../internal";

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
