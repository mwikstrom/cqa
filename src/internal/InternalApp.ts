import { App } from "../public/App";
import { CancelTokenSource } from "../public/CancelTokenSource";

import { invariant } from "./Demand";
import { InternalOf } from "./InternalOf";
import { InternalQuery } from "./InternalQuery";

export class InternalApp extends InternalOf<App> {
    private _observedQueries = new Map<string, Set<InternalQuery>>();

    public getObservedQueries(key: string): Iterable<InternalQuery> {
        return this._observedQueries.get(key) || [];
    }

    public registerObservedQuery(
        query: InternalQuery,
    ): () => void {
        let instances = this._observedQueries.get(query.key);

        if (!instances) {
            this._observedQueries.set(query.key, instances = new Set<InternalQuery>());
        }

        if (process.env.NODE_ENV !== "production") {
            invariant(
                !instances.has(query),
                `Query instance already registered as observed`,
            );
        }

        // Create a cancel token to be observed while populating. It will be cancelled when the query is unobserved.
        const cts = new CancelTokenSource();

        // Add registered instance and start populating query in a background task
        instances.add(query);
        query.populateInBackground(cts.token);

        // Return a callback function that shall be invoked when the query becomes unobserved
        return () => {
            // Cancel the populating background task when query become unobserved
            cts.cancel();

            // Remove registered instance and stop executing query on backend if it was the last instance
            if (instances!.delete(query) && instances!.size === 0) {
                this.stopQuerySubscription(query.key);
            }
        };
    }

    public startQuerySubscription(
        key: string,
    ) {
        // TODO: IMPLEMENT startQuerySubscription
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
