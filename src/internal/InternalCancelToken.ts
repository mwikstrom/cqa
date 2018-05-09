import {
    action,
    observable,
} from "mobx";

import { CancelToken } from "../api";

import { InternalBase } from "../internal";

export class InternalCancelToken extends InternalBase<CancelToken> {
    @observable
    private _isCancelled = false;

    public get isCancelled(): boolean {
        return this._isCancelled;
    }

    @action
    public setCancelled(): void {
        this._isCancelled = true;
    }
}
