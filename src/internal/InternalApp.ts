import {
    App,
    CancelTokenSource,
} from "../api";

import {
    DEBUG,
    InternalOf,
    InternalQuery,
    invariant,
} from "../internal";

export class InternalApp extends InternalOf<App> {
    private _activeQueries = new Map<string, Set<InternalQuery>>();

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
        // TODO: IMPLEMENT ensureQuerySubscriptionStarted
        //       - No-op if subscription already started
        //       - Must verify that there is at least one instance for the specified key
        //       - All instances must agree to:
        //          a) use the same key
        //          b) use the same descriptor
        //          c) support incremental updates
        //          d) have the same current version
        //          e) not be broken
        throw key;
    }

    public stopQuerySubscription(
        key: string,
    ) {
        // TODO: Verify that there are instances for the specified key!
        // TODO: IMPLEMENT stopQuerySubscription
        throw key;
    }
}
