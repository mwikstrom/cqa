import { observable } from "mobx";
import { asyncAction } from "mobx-utils";

import { demand } from "../utils/demand";
import { InternalOf } from "../utils/internal";
import { App } from "./App";
import { AppState } from "./AppState";
import {
    DEFAULT_REALM,
    IAppOptions,
} from "./IAppOptions";

export class InternalApp extends InternalOf<App> {
    @observable
    private _realm?: string;

    @observable
    private _state: AppState = AppState.Uninitialized;

    public get realm() {
        demand(this.state >= AppState.Initialized);
        return this._realm!;
    }

    public get state() {
        return this._state;
    }

    @asyncAction
    public * initialize(
        options?: IAppOptions,
    ) {
        const {
            realm = DEFAULT_REALM,
        } = options || {};

        demand(
            this._state === AppState.Uninitialized,
            `${App.name} can only be initialized when in the uninitialized state`,
        );

        try {
            this._state = AppState.Initializing;

            // TODO: Do async initialization stuff
            yield 0;

            this._realm = realm;
            this._state = AppState.Initialized;
        } catch (error) {
            this._state = AppState.Uninitialized;
            throw error;
        }
    }

    @asyncAction
    public * dispose() {
        const stateBefore = this._state;

        demand(
            stateBefore === AppState.Uninitialized ||
            stateBefore === AppState.Initialized,
            `Attempt to dispose ${App.name} while initializing or already disposing`,
        );

        try {
            this._state = AppState.Disposing;

            // TODO: Do async stuff
            yield 0;

            this._state = AppState.Disposed;
        } catch (error) {
            this._state = stateBefore;
            throw error;
        }
    }
}
