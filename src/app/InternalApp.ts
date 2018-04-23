import { observable } from "mobx";
import { action } from "mobx";

import { ConfigurationLockError, DisposeError } from "../error";
import { demand } from "../utils/demand";
import { InternalOf } from "../utils/internal";
import { App } from "./App";
import {
    DEFAULT_REALM,
    IAppOptions,
} from "./IAppOptions";

export class InternalApp extends InternalOf<App> {
    @observable
    private _isConfigurationLocked = false;

    @observable
    private _isDisposed = false;

    @observable
    private _realm = DEFAULT_REALM;

    public get isConfigurationLocked(): boolean {
        return this._isConfigurationLocked;
    }

    public get isDisposed(): boolean {
        return this._isDisposed;
    }

    public get realm(): string {
        return this._realm!;
    }

    @action
    public configure(
        options: IAppOptions,
    ): void {
        demand(!this.isDisposed, DisposeError);
        demand(!this.isConfigurationLocked, ConfigurationLockError);

        const {
            realm = DEFAULT_REALM,
        } = options;

        this._realm = realm;
    }

    @action
    public dispose() {
        if (!this.isDisposed) {
            this._isDisposed = true;
        }
    }

    @action
    public lockConfiguration(): void {
        this._isConfigurationLocked = true;
    }
}
