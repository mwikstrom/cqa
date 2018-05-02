import {
    action,
    observable,
} from "mobx";

import { ReadonlyJsonValue } from "../public/Json";
import { Query } from "../public/Query";
import { Version } from "../public/Version";

import { demand } from "./Demand";
import { InternalOf } from "./InternalOf";

export class InternalQuery extends InternalOf<Query> {
    private _descriptor?: ReadonlyJsonValue;

    private _key?: string;

    @observable.ref
    private _version: Version | null = null;

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = this.pub.buildDescriptor();
        }

        return this._descriptor;
    }

    public get key(): string {
        if (this._key === undefined) {
            this._key = this.pub.buildKey();
        }

        return this._key;
    }

    public get version(): Version | null {
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
        this._version = version;
    }
}
