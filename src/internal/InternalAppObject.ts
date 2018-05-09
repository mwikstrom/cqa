import {
    action,
    computed,
    observable,
} from "mobx";

import {
    AlreadyAttachedError,
    App,
    AppObject,
    NotAttachedError,
} from "../api";

import {
    demand,
    InternalBase,
} from "../internal";

export class InternalAppObject extends InternalBase<AppObject> {
    @observable.ref
    private _app: App | null = null;

    public get app(): App {
        demand(this.isAttached, NotAttachedError);
        return this._app!;
    }

    @computed
    public get isAttached(): boolean {
        return this._app !== null;
    }

    @action
    public attachTo(app: App): void {
        demand(
            !this.isAttached || this._app === app,
            AlreadyAttachedError,
        );
        this._app = app;
    }
}
