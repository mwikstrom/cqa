import { action, computed, observable } from "mobx";

import { AlreadyAttachedError } from "../public/AlreadyAttachedError";
import { App } from "../public/App";
import { AppObject } from "../public/AppObject";
import { NotAttachedError } from "../public/NotAttachedError";

import { demand } from "./Demand";
import { InternalOf } from "./InternalOf";

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