import {
    action,
    computed,
    createAtom,
    IAtom,
    observable,
    runInAction,
    when,
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

    @computed
    public get isActive(): boolean {
        return this.pub.isAttached && this.isObserved && !this.isBroken;
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

            // Defer applying command while populating
            when(
                () => !this.isPopulating,
                () => {
                    // TODO: Ensure there is a pre-command snapshot

                    // TODO: Track command completion

                    // Apply command to query result
                    this.pub.onCommand(command.pub);
                    this._atom.reportChanged();
                },
                {
                    onError: error => this._onBreakingError("Failed to pre-apply command", error),
                },
            );

            return true;
        } catch (error) {
            this._onBreakingError("Failed to pre-apply command", error);
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
            this._version = version;

            // TODO: Re-apply tracked commands

            this._atom.reportChanged();
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
            this._version = version;

            // TODO: Re-apply tracked commands

            this._atom.reportChanged();
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
            demand(!this._isPopulating, "Query is already being populated");
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
        demand(!this._isPopulating, "Cannot reset query while it is being populated");

        try {
            this.pub.onReset();
            this._version = null;

            // TODO: Clear tracked commands

            this._markAsBroken(false);
            this._atom.reportChanged();

            // Re-populate in background if active
            if (this.isActive) {
                const cts = new CancelTokenSource();
                cts.cancelWhen(() => !this.isActive);
                // TODO: FIX: This causes an error!
                // this.populateInBackground(cts.token);
            }
        } catch (error) {
            this._onBreakingError("Failed to reset", error);
        }
    }

    private _checkNextVersion(next: string): void {
        const before = this._version;
        demand(
            before === null || next > before,
            `Cannot upgrade from version ${before} to ${next}`,
        );
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

        // Build current snapshot (including changes from tracked commands)
        const snapshot = source.pub.tryBuildSnapshot();
        if (snapshot === undefined) {
            return false;
        }

        // Apply current snapshot
        this.applySnapshot(snapshot, version);

        // TODO: Copy tracked commands and pre-command snapshot (if any) too

        return true;
    }

    private async _tryPopulateFromStore(
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        //       - Beware that server snapshot or update might arrive while loading from store!
        //       - Discover and re-apply active and unseen committed commands too!
        return !token; // dummy
    }
}
