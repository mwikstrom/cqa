import { action, computed, observable } from "mobx";

import { AlreadyAttachedError, NotAttachedError } from "../error";
import { demand } from "../utils/demand";
import { InternalOf } from "../utils/internal";
import { App } from "./App";
import { AppObject } from "./AppObject";

export class InternalAppObject extends InternalOf<AppObject> {
    @observable
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
