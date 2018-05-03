import { observable } from "mobx";
import { action } from "mobx";

import { App } from "../public/App";
import { ConfigurationLockError } from "../public/ConfigurationLockError";
import { DisposeError } from "../public/DisposeError";
import { IAppOptions } from "../public/IAppOptions";

import { DEFAULT_REALM } from "./Constants";
import { demand } from "./Demand";
import { InternalOf } from "./InternalOf";
import { InternalQuery } from "./InternalQuery";

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

        if (defined(options.realm)) {
            // TODO: Validate options.realm (require non-empty and only url safe segment chars)
            this._realm = options.realm;
        }
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

    public registerObservedQuery(
        _: InternalQuery,
    ): () => void {
        // TODO: Implement query subscription
        return () => { /* no-op */ };
    }
}

const defined = <T>(
    arg: T | undefined,
): arg is T => arg !== undefined;
