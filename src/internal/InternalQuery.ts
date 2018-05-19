import {
    action,
    createAtom,
    IAtom,
    observable,
    runInAction,
} from "mobx";

import {
    CancelToken,
    CancelTokenSource,
    Query,
    ReadonlyJsonValue,
} from "../api";

import {
    DEBUG,
    deepEquals,
    demand,
    freezeDeep,
    InternalBase,
    InternalCommand,
    internalOf,
    LIB_NAME_SHORT,
} from "../internal";

export class InternalQuery extends InternalBase<Query> {
    private _atom: IAtom;

    private _descriptor?: ReadonlyJsonValue;

    @observable
    private _isBroken = false;

    @observable
    private _isObserved = false;

    @observable
    private _isPopulating = false;

    private _key?: string;

    @observable
    private _version: string | null = null;

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
            this._descriptor = freezeDeep(this.pub.buildDescriptor());
        }

        return this._descriptor;
    }

    public get isBroken(): boolean {
        return this._isBroken;
    }

    public get isObserved(): boolean {
        return this._isObserved;
    }

    public get isPopulating(): boolean {
        return this._isPopulating;
    }

    public get key(): string {
        if (this._key === undefined) {
            this._key = this.pub.buildKey();
        }

        return this._key;
    }

    public get version(): string | null {
        this.reportObserved();
        return this._version;
    }

    @action
    public applyCommand(
        command: InternalCommand,
    ): boolean {
        try {
            // istanbul ignore else
            if (DEBUG) {
                // Command and query must be attached to the same app
                demand(command.pub.isAttached);
                demand(this.pub.isAttached);
                demand(command.pub.app === this.pub.app);

                // Rejected commands shall never be applied to queries
                demand(!command.isRejected);
            }

            // Ignore committed commands with a version lower than or equal to the last seen query result version.
            const committed = command.commitVersion;
            const seen = this.version;
            if (committed !== null && seen !== null && seen > committed) {
                return false;
            }

            // Ignore commands that may not affect result
            if (!this.pub.mayAffectResult(command.pub)) {
                return false;
            }

            // TODO: Defer applying command while populating

            // TODO: Track command completion

            // TODO: Ensure there is a pre-command snapshot

            // Apply command to query result
            this.pub.onCommand(command.pub);
            this._atom.reportChanged();

            return true;
        } catch (error) {
            this._onBreakingError("Failed to apply command", error);
            return false;
        }
    }

    @action
    public applySnapshot(
        data: ReadonlyJsonValue,
        version: string,
    ): void {
        try {
            // istanbul ignore else
            if (DEBUG) {
                this._checkNextVersion(version);
            }

            this.pub.onSnapshot(data);
            this._atom.reportChanged();
            this._version = version;
        } catch (error) {
            this._onBreakingError("Failed to apply snapshot", error);
        }
    }

    @action
    public applyUpdate(
        data: ReadonlyJsonValue,
        version: string,
    ): void {
        try {
            // istanbul ignore else
            if (DEBUG) {
                this._checkNextVersion(version);
            }

            this.pub.onUpdate(data);
            this._atom.reportChanged();
            this._version = version;
        } catch (error) {
            this._onBreakingError("Failed to apply update", error);
        }
    }

    @action
    public applyVersion(
        version: string,
    ): void {
        try {
            // istanbul ignore else
            if (DEBUG) {
                this._checkNextVersion(version);
            }

            this._version = version;
        } catch (error) {
            this._onBreakingError("Failed to apply version", error);
        }
    }

    public hasCompatibleSubscriptionContract(other: InternalQuery) {
        return this.key === other.key
            && deepEquals(this.descriptor, other.descriptor)
            && this.pub.supportsIncrementalUpdates === other.pub.supportsIncrementalUpdates
            && this.version === other.version;
    }

    public populateInBackground(
        token: CancelToken,
    ): void {
        // istanbul ignore else
        if (DEBUG) {
            demand(!this._isPopulating);
        }

        runInAction(() => this._isPopulating = true);

        token.ignoreCancellation(
            this._populate(token),
        ).catch(reason =>
            this._onBreakingError("Could not be populated", reason),
        ).then(() =>
            runInAction(() => this._isPopulating = false),
        );
    }

    public reportObserved() {
        this._atom.reportObserved();
    }

    @action
    public reset() {
        try {
            this.pub.onReset();
            this._version = null;
            this._markAsBroken(false);
            this._atom.reportChanged();
        } catch (error) {
            this._onBreakingError("Failed to reset", error);
        }
    }

    private _checkNextVersion(next: string): void {
        const before = this._version;
        demand(before === null || next > before);
    }

    private async _compute(
        token: CancelToken,
    ): Promise<void> {
        const cts = new CancelTokenSource();
        const dispose = cts.cancelWhen(() => token.isCancelled || this.version !== null);

        try {
            const applySnapshot = cts.token.bind(this.pub.onSnapshot, this.pub);
            const applyUpdate = cts.token.bind(this.pub.onUpdate, this.pub);

            // TODO: It is important that user code does not cause new query subscriptions to open
            //       when deriving local result. How to ensure that?

            return await cts.token.ignoreCancellation(
                this.pub.compute(
                    applySnapshot,
                    applyUpdate,
                    cts.token,
                ),
            );
        } finally {
            cts.cancel();
            dispose();
        }
    }

    private _findFirstClone(): InternalQuery | null {
        for (const other of internalOf(this.pub.app).getActiveQueries(this.key)) {
            if (other !== this) {
                return other;
            }
        }

        return null;
    }

    @action
    private _markAsBroken(value = true): void {
        this._isBroken = value;
    }

    private _onBecomeObserved = () => {
        this._isObserved = true;
    }

    private _onBecomeUnobserved = () => {
        this._isObserved = false;
    }

    private _onBreakingError(cause: string, error: any): void {
        this._markAsBroken();

        // tslint:disable-next-line
        this.pub.app.console.warn(
            `[${LIB_NAME_SHORT}] Query is broken. ${cause}. ${error}`,
        );
    }

    private async _populate(
        token: CancelToken,
    ): Promise<void> {
        // The fastest way to populate a query is to copy from a clone, another active query instance with the same
        // key as this query instance. Attempting to do so is a synchronous operation.
        if (this._tryPopulateFromClone()) {
            return; // Done. Populated from a clone.
        }

        // TODO: Look for and register applicable pending and unseen committed commands.

        await this._tryPopulateFromStore(token);

        internalOf(this.pub.app).ensureQuerySubscriptionStarted(this.key);

        if (!this.version) {
            await this._compute(token);
        }
    }

    private _tryPopulateFromClone(): boolean {
        // Look for another active query instance with the same key
        const source = this._findFirstClone();
        if (!source) {
            return false;
        }

        // Instances that does not have a version token are either hollow or computed locally.
        // We don't want to (and cannot) populate from such a clone.
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
