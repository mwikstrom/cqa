import {
    action,
    createAtom,
    IAtom,
    observable,
    when,
} from "mobx";

import { App } from "../public/App";
import { CancelToken } from "../public/CancelToken";
import { CancelTokenSource } from "../public/CancelTokenSource";
import { ReadonlyJsonValue } from "../public/Json";
import { Query } from "../public/Query";
import { Version } from "../public/Version";

import { demand } from "./Demand";
import { InternalApp } from "./InternalApp";
import { InternalOf, makeInternalOf } from "./InternalOf";

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
            this._onBecomeObserved,
            this._onBecomeUnobserved,
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

    public populateInBackground(
        token: CancelToken,
    ): void {
        token.ignoreCancellation(this._populate(token)).catch(reason => {
            // TODO: Report error and mark query as broken
            // tslint:disable-next-line
            console.error(reason); // report better!
        });
    }

    public reportObserved() {
        this._atom.reportObserved();
    }

    private async _deriveFromOther(
        token: CancelToken,
    ): Promise<void> {
        const cts = new CancelTokenSource();
        const disposeReaction = when(
            () => token.isCancelled || this.version !== null,
            () => cts.cancel(),
        );

        try {
            const applySnapshot = (data: ReadonlyJsonValue) => {
                cts.token.throwIfCancelled();
                this.pub.onSnapshot(data);
            };

            const applyUpdate = (data: ReadonlyJsonValue) => {
                cts.token.throwIfCancelled();
                this.pub.onUpdate(data);
            };

            return await cts.token.ignoreCancellation(
                this.pub.deriveLocalResult(
                    applySnapshot,
                    applyUpdate,
                    cts.token,
                ),
            );
        } finally {
            disposeReaction();
        }
    }

    private _findFirstClone(): InternalQuery | null {
        for (const other of internalAppOf(this).getObservedQueries(this.key)) {
            if (other !== this) {
                return other;
            }
        }

        return null;
    }

    private _onBecomeObserved = () => {
        this._isObserved = true;
    }

    private _onBecomeUnobserved = () => {
        this._isObserved = false;
    }

    private async _populate(
        token: CancelToken,
    ): Promise<void> {
        // The fastest way to populate a query is to copy from a clone, another observed query instance with the same
        // key as this query instance. Attempting to do so is a synchronous operation.
        if (this._tryPopulateFromClone()) {
            return; // Done. Populated from a clone.
        }

        // TODO: Look for and register applicable pending and unseen committed commands.

        await this._tryPopulateFromStore(token);

        internalAppOf(this).startQuerySubscription(this.key);

        if (!this.version) {
            await this._deriveFromOther(token);
        }
    }

    private _tryPopulateFromClone(): boolean {
        // Look for another observed query instance with the same key
        const source = this._findFirstClone();
        if (!source) {
            return false;
        }

        // Instances that does not have a version token are either hollow or are derived from other queries locally,
        // we don't want to (and cannot) populate from such a clone.
        const version = source.version;
        if (!version) {
            return false;
        }

        const snapshot = source.pub.tryBuildSnapshot();
        if (snapshot === undefined) {
            return false;
        }

        // TODO: Clone pending and unseen committed commands too! (but don't reapply them!)

        this.applySnapshot(snapshot, version);
        return true;
    }

    private async _tryPopulateFromStore(
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        //       - Beware that server snapshot or update might arrive while loading from store!
        //       - Remember to re-apply pending and unseen committed commands too!
        return !token; // dummy
    }
}

const appInternalOf = makeInternalOf(App, InternalApp);

const internalAppOf = (query: InternalQuery) => appInternalOf(query.pub.app);
