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
    private _commitVersion: null | string = null;

    private _descriptor?: ReadonlyJsonValue;

    private _id?: string;

    @observable
    private _isBroken = false;

    @observable
    private _isRejected = false;

    public get commitVersion(): null | string {
        return this._commitVersion;
    }

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = freezeDeep(this.pub.buildDescriptor());
        }

        return this._descriptor;
    }

    public get id(): string {
        if (this._id === undefined) {
            this._id = createIdentifier();
        }

        return this._id;
    }

    public get isBroken(): boolean {
        return this._isBroken;
    }

    @computed
    public get isCompleted(): boolean {
        return this._commitVersion !== null || this._isRejected;
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
}
