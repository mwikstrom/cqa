import {
    App,
    CancelTokenSource,
    Command,
    CommandFactory,
    ISimpleConsole,
    Query,
    QueryFactory,
    ReadonlyJsonValue,
    UnknownCommand,
    UnknownQuery,
} from "../api";

import {
    DEBUG,
    deepEquals,
    InternalBase,
    InternalQuery,
    invariant,
} from "../internal";

export class InternalApp extends InternalBase<App> {
    private _activeQueries = new Map<string, Set<InternalQuery>>();
    private _activeSubscriptions = new Set<string>();
    private _console: ISimpleConsole = console;
    private _commandFactories = new Set<CommandFactory>();
    private _queryFactories = new Set<QueryFactory>();

    public get console(): ISimpleConsole {
        return this._console;
    }

    public set console(value: ISimpleConsole) {
        this._console = value;
    }

    public addCommandFactory(factory: CommandFactory): void {
        this._commandFactories.add(factory);
    }

    public addQueryFactory(factory: QueryFactory): void {
        this._queryFactories.add(factory);
    }

    public createCommand(
        descriptor: ReadonlyJsonValue,
    ): Command {
        for (const factory of this._commandFactories) {
            const result = factory(descriptor);
            if (result !== undefined) {
                // istanbul ignore else
                if (DEBUG) {
                    invariant(
                        deepEquals(descriptor, result.descriptor),
                        "Constructed command has unexpected descriptor",
                    );
                }

                return result.attachTo(this.pub);
            }
        }

        return new UnknownCommand(descriptor).attachTo(this.pub);
    }

    public createQuery(
        descriptor: ReadonlyJsonValue,
        key?: string,
    ): Query {
        for (const factory of this._queryFactories) {
            const result = factory(descriptor);
            if (result !== undefined) {
                // istanbul ignore else
                if (DEBUG) {
                    invariant(
                        deepEquals(descriptor, result.descriptor),
                        "Constructed query has unexpected descriptor",
                    );

                    if (typeof key === "string") {
                        invariant(
                            key === result.key,
                            "Constructed query has unexpected key",
                        );
                    }
                }

                return result.attachTo(this.pub);
            }
        }

        return new UnknownQuery(descriptor, key).attachTo(this.pub);
    }

    public getActiveQueries(key: string): Iterable<InternalQuery> {
        return this._activeQueries.get(key) || [];
    }

    public registerActiveQuery(
        query: InternalQuery,
    ): () => void {
        let instances = this._activeQueries.get(query.key);

        if (!instances) {
            this._activeQueries.set(query.key, instances = new Set<InternalQuery>());
        }

        // istanbul ignore else
        if (DEBUG) {
            invariant(
                !instances.has(query),
                `Query instance already registered as active`,
            );
        }

        // Create a cancel token to be observed while populating. It will be cancelled when the query is deactivated
        const cts = new CancelTokenSource();

        // Add registered instance and start populating query in a background task
        instances.add(query);
        query.populateInBackground(cts.token);

        // Return a callback function that shall be invoked when the query is deactivated
        return () => {
            // Cancel the populating background task when query is deactivated
            cts.cancel();

            // Remove registered instance and stop executing query on backend if it was the last instance
            if (instances!.delete(query) && instances!.size === 0) {
                this.stopQuerySubscription(query.key);
            }
        };
    }

    public ensureQuerySubscriptionStarted(
        key: string,
    ) {
        // In non-production environment; ensure that all instances agree to use the same subscription contract
        // istanbul ignore else
        if (DEBUG) {
            const active = this._activeQueries.get(key);
            // istanbul ignore else
            if (active) {
                let specimen: InternalQuery | null = null;
                for (const query of active) {
                    if (!specimen) {
                        specimen = query;
                    } else {
                        invariant(
                            query.hasCompatibleSubscriptionContract(specimen),
                            "All same-key active queries must share a compatible subscription contract",
                        );
                    }
                }
            }
        }

        if (!this._activeSubscriptions.has(key)) {
            this._activeSubscriptions.add(key);
            // TODO: Send `Start_Query` message to backend.
        }
    }

    public stopQuerySubscription(
        key: string,
    ): void {
        // istanbul ignore else
        if (DEBUG) {
            const active = this._activeQueries.get(key);
            invariant(
                !active || active.size === 0,
                "Cannot stop subscription while there are active instances",
            );
        }

        if (this._activeSubscriptions.delete(key)) {
            // TODO: Send `Stop_Query` message to backend
        }
    }
}
