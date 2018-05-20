import {
    action,
    computed,
    createAtom,
    IAtom,
    IReactionDisposer,
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
    freezeDeepIfDefined,
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

    private _trackedCommands = new Set<InternalCommand>();

    private _completionTrackerMap = new WeakMap<InternalCommand, IReactionDisposer>();

    private _preCommandSnapshot?: ReadonlyJsonValue;

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
    ): void {
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
            if (this._hasSeenCommitOf(command)) {
                return;
            }

            // Ignore commands that may not affect result
            if (!this.pub.mayAffectResult(command.pub)) {
                return;
            }

            // Defer applying command while populating
            when(
                () => !this.isPopulating,
                () => {
                    // Command may have been rejected by now. No need to track a rejected command.
                    if (command.isRejected) {
                        return;
                    }

                    // We may have seen the committed version by now. No need to track such a command.
                    if (this._hasSeenCommitOf(command)) {
                        return;
                    }

                    // Try to build a pre-command snapshot when this is the first command to track.
                    if (this._trackedCommands.size === 0) {
                        this._preCommandSnapshot = freezeDeepIfDefined(this.pub.tryBuildSnapshot());
                    }

                    // Add command to the set of tracked commands
                    this._trackedCommands.add(command);

                    // Track command completion unless it's already completed
                    if (!command.isCompleted) {
                        this._startCompletionTracker(command);
                    }

                    // Apply command to query result
                    this.pub.onCommand(command.pub);
                    this._atom.reportChanged();
                },
                {
                    onError: error => this._onBreakingError("Failed to apply command", error),
                },
            );

            return;
        } catch (error) {
            this._onBreakingError("Failed to pre-apply command", error);
            return;
        }
    }

    @action
    public applySnapshot(
        data: ReadonlyJsonValue,
        version: string,
    ): void {
        try {
            // Apply snapshot and upgrade version
            this.pub.onSnapshot(data);
            this._upgradeVersion(version);

            // Update pre-command snapshot and re-apply tracked commands (if any)
            if (this._trackedCommands.size > 0) {
                this._preCommandSnapshot = data;
                this._applyTrackedCommands();
            }

            // Report that result changed (trigger reactions)
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
            // Upgrade version first, this might cause some (or all) tracked commands to be resolved
            // and no longer being tracked.
            this._upgradeVersion(version);

            // When there are tracked commands remaining we must roll back to the pre-command snapshot
            // before applying the update and then re-apply the tracked commands.
            if (this._trackedCommands.size === 0) {
                // There are no tracked commands, just apply the update
                this.pub.onUpdate(data);
            } else {
                // Ensure that there is a pre-command snapshot to roll back to
                demand(
                    this._preCommandSnapshot !== undefined,
                    "Cannot apply update on a query with tracked commands without a pre-command snapshot",
                );

                // Apply the pre-command snapshot
                this.pub.onSnapshot(this._preCommandSnapshot!);

                // Then apply the update
                this.pub.onUpdate(data);

                // Finally re-apply the tracked commands
                this._applyTrackedCommands();
            }

            // Report that result changed (trigger reactions)
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
            this._upgradeVersion(version);
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
            // Let user code reset query result
            this.pub.onReset();

            // Reset version
            this._version = null;

            // Stop tracking commands
            this._trackedCommands.forEach(tracked => this._stopCompletionTracker(tracked));
            this._trackedCommands.clear();
            this._preCommandSnapshot = undefined;

            // Clear broken flag (if set)
            this._markAsBroken(false);

            // Report that query result changed
            this._atom.reportChanged();
        } catch (error) {
            this._onBreakingError("Failed to reset", error);
        }
    }

    private _applyTrackedCommands(): void {
        const pub = this.pub;
        this._trackedCommands.forEach(tracked => pub.onCommand(tracked.pub));
    }

    private _checkNextVersion(next: string): void {
        const before = this._version;
        demand(
            before === null || next > before,
            `Cannot upgrade from version ${before} to ${next}`,
        );
    }

    private async _computeLocal(
        token: CancelToken,
    ): Promise<void> {
        const cts = new CancelTokenSource();
        const dispose = cts.cancelWhen(() => token.isCancelled || this.version !== null);

        try {
            const applySnapshot = cts.token.bind(this.pub.onSnapshot, this.pub);
            const applyUpdate = cts.token.bind(this.pub.onUpdate, this.pub);

            // TODO: It is important that user code does not cause new query subscriptions to open
            //       when deriving local result. It is also important that user codes does not
            //       compute from other queries that are being populated. Must wait for population
            //       to complete BUT NOT cause server query subscription to start.

            return await cts.token.ignoreCancellation(
                this.pub.computeLocal(
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

    private _hasSeenCommitOf(command: InternalCommand) {
        const seen = this.version;
        const committed = command.commitVersion;
        return seen !== null && committed !== null && seen >= committed;
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

    private _onCommandCompletion(command: InternalCommand): void {
        // istanbul ignore else
        if (DEBUG) {
            demand(command.isCompleted);
            demand(this._trackedCommands.has(command));
            demand(this._completionTrackerMap.has(command));
        }

        // Remove mapped disposer
        this._completionTrackerMap.delete(command);

        if (command.isRejected) {
            this._onCommandRejected(command);
        } else {
            this._onCommandAccepted(command);
        }
    }

    private _onCommandAccepted(command: InternalCommand): void {
        // istanbul ignore else
        if (DEBUG) {
            demand(command.isCompleted);
            demand(!command.isRejected);
            demand(command.commitVersion !== null);
        }

        // If the committed version is already seen then we'll remove the command from the set
        // of tracked commands; otherwise we'll keep tracking it until that version is seen.
        if (this._hasSeenCommitOf(command)) {
            this._trackedCommands.delete(command);

            // Clear pre-command snapshot when there are no more remaining tracked commands
            if (this._trackedCommands.size === 0) {
                this._preCommandSnapshot = undefined;
            }
        }
    }

    @action
    private _onCommandRejected(command: InternalCommand): void {
        // istanbul ignore else
        if (DEBUG) {
            demand(command.isCompleted);
            demand(command.isRejected);
            demand(command.commitVersion === null);
        }

        // Remove from tracked command set
        this._trackedCommands.delete(command);

        // Assert that we have a pre-command snapshot
        demand(
            this._preCommandSnapshot !== undefined,
            "Unable to handle command rejection without a pre-command snapshot",
        );

        // Rollback to the pre-command snapshot
        this.pub.onSnapshot(this._preCommandSnapshot!);

        // Apply any remaining tracked commands; otherwise, when there are no remaining tracked commands,
        // clear the pre-command snapshot
        if (this._trackedCommands.size > 0 ) {
            this._applyTrackedCommands();
        } else {
            this._preCommandSnapshot = undefined;
        }

        // Report as changed
        this._atom.reportChanged();
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
            await this._computeLocal(token);
        }
    }

    private _startCompletionTracker(command: InternalCommand): void {
        // istanbul ignore else
        if (DEBUG) {
            demand(!command.isCompleted);
            demand(this._trackedCommands.has(command));
            demand(!this._completionTrackerMap.has(command));
        }

        this._completionTrackerMap.set(command, when(
            () => command.isCompleted,
            () => this._onCommandCompletion(command),
            {
                onError: error => this._onBreakingError("Failed to handle command completion", error),
            },
        ));
    }

    private _stopCompletionTracker(command: InternalCommand): void {
        const disposer = this._completionTrackerMap.get(command);

        if (disposer) {
            disposer();
            this._completionTrackerMap.delete(command);
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

        // Copy pre-command snapshot and tracked commands
        this._preCommandSnapshot = source._preCommandSnapshot;
        source._trackedCommands.forEach(tracked => {
            this._trackedCommands.add(tracked);
            if (!tracked.isCompleted) {
                this._startCompletionTracker(tracked);
            }
        });

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

    private _upgradeVersion(next: string) {
        // istanbul ignore else
        if (DEBUG) {
            this._checkNextVersion(next);
        }

        // Assign the new version
        this._version = next;

        // Purge tracked commands that were committed in a previous version (we've seen their effect now)
        this._trackedCommands.forEach(tracked => {
            if (this._hasSeenCommitOf(tracked)) {
                this._trackedCommands.delete(tracked);
            }
        });

        // Clear pre-command snapshot when there are no more remaining tracked commands
        if (this._trackedCommands.size === 0) {
            this._preCommandSnapshot = undefined;
        }
    }
}
