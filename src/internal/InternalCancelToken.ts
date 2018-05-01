import { observable } from "mobx";

import { CancelToken } from "../public/CancelToken";

import { InternalOf } from "./InternalOf";

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
