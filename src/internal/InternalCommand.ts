import {
    action,
    computed,
    observable,
} from "mobx";

import {
    Command,
    ReadonlyJsonValue,
} from "../api";

import {
    createIdentifier,
    DEBUG,
    demand,
    freezeDeep,
    InternalBase,
} from "../internal";

export class InternalCommand extends InternalBase<Command> {
    @observable
    private _commitVersion?: string;

    private _descriptor?: ReadonlyJsonValue;

    private _globalId?: string;

    @observable
    private _isBroken = false;

    @observable
    private _isRejected = false;

    @observable
    private _localId?: number;

    public get commitVersion(): null | string {
        const value = this._commitVersion;
        return value === undefined ? null : value;
    }

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = freezeDeep(this.pub.buildDescriptor());
        }

        return this._descriptor;
    }

    public get globalId(): string {
        if (this._globalId === undefined) {
            this._globalId = createIdentifier();
        }

        return this._globalId;
    }

    public get localId(): number | null {
        const value = this._localId;
        return value === undefined ? null : value;
    }

    public get isBroken(): boolean {
        return this._isBroken;
    }

    @computed
    public get isCompleted(): boolean {
        return this._commitVersion !== undefined || this._isRejected;
    }

    public get isRejected(): boolean {
        return this._isRejected;
    }

    @action
    public markAsBroken(value = true) {
        this._isBroken = value;
    }

    @action
    public onAccepted(
        commitVersion: string,
    ) {
        // istanbul ignore else
        if (DEBUG) {
            demand(!this.isCompleted);
        }

        this.markAsBroken(false);
        this._commitVersion = commitVersion;
    }

    @action
    public onRejected() {
        // istanbul ignore else
        if (DEBUG) {
            demand(!this.isCompleted);
        }

        this.markAsBroken(false);
        this._isRejected = true;
    }

    @action
    public onStored(
        localId: number,
    ) {
        // instanbul ignore else
        if (DEBUG) {
            demand(this._localId === undefined);
        }

        this._localId = localId;
    }
}
