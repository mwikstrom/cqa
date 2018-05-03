import {
    action,
    createAtom,
    IAtom,
    observable,
} from "mobx";

import { ReadonlyJsonValue } from "../public/Json";
import { Query } from "../public/Query";
import { Version } from "../public/Version";

import { demand } from "./Demand";
import { InternalOf } from "./InternalOf";

export class InternalQuery extends InternalOf<Query> {
    private _atom: IAtom;

    private _descriptor?: ReadonlyJsonValue;

    @observable
    private _isObserved = false;

    private _key?: string;

    @observable.ref
    private _version: Version | null = null;

    constructor(pub: Query) {
        super(pub);

        this._atom = createAtom(
            pub.constructor.name,
            this.onBecomeObserved,
            this.onBecomeUnobserved,
        );
    }

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = this.pub.buildDescriptor();
        }

        return this._descriptor;
    }

    public get isObserved(): boolean {
        return this._isObserved;
    }

    public get key(): string {
        if (this._key === undefined) {
            this._key = this.pub.buildKey();
        }

        return this._key;
    }

    public get version(): Version | null {
        this.reportObserved();
        return this._version;
    }

    @action
    public applySnapshot(
        data: ReadonlyJsonValue,
        version: Version,
    ): void {
        const before = this._version;
        demand(before === null || version.isAfter(before));
        this.pub.onSnapshot(data);
        this._atom.reportChanged();
        this._version = version;
    }

    @action
    public applyUpdate(
        data: ReadonlyJsonValue,
        version: Version,
    ): void {
        const before = this._version;
        demand(before === null || version.isAfter(before));
        this.pub.onUpdate(data);
        this._atom.reportChanged();
        this._version = version;
    }

    @action
    public applyVersion(
        version: Version,
    ): void {
        const before = this._version;
        demand(before === null || version.isAfter(before));
        this._version = version;
    }

    public reportObserved() {
        this._atom.reportObserved();
    }

    private onBecomeObserved = () => {
        this._isObserved = true;
    }

    private onBecomeUnobserved = () => {
        this._isObserved = false;
    }
}
