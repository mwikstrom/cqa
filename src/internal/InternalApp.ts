import { App } from "../public/App";
import { CancelToken } from "../public/CancelToken";
import { CancelTokenSource } from "../public/CancelTokenSource";

import { invariant } from "./Demand";
import { InternalOf } from "./InternalOf";
import { InternalQuery } from "./InternalQuery";

export class InternalApp extends InternalOf<App> {
    private _observedQueries = new Map<string, Set<InternalQuery>>();

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

        const cts = new CancelTokenSource();

        // Add registered instance and start executing query on backend if it is the first instance
        instances.add(query);
        if (instances.size === 1) {
            // TODO: Execute query on backend. Cancel token source when first snapshot arrives.
        }

        // TODO: Must delay backend execution until query was populated locally so that we have a chance to get
        //       catch-up deltas instead of a full initial snapshot.

        cts.token.ignoreCancellation(this._populateQuery(query, cts.token));

        // Return the `registerUnobservedQuery` callback function
        return () => {
            // Cancel the populating task, if it is still pending
            cts.cancel();

            // Remove registered instance and stop executing query on backend if it was the last instance
            instances!.delete(query);
            if (instances!.size === 0) {
                // TODO: Stop query on backend.
            }
        };
    }

    // TODO: Move to InternalQuery
    private async _populateQuery(
        query: InternalQuery,
        token: CancelToken,
    ) {
        if (this._tryPopulateQueryFromClone(query)) {
            return;
        }

        if (await this._tryPopulateQueryFromStore(query, token)) {
            // TODO: Apply pending and unseen committed commands.
            return;
        }

        if (!query.version) {
            // TODO: This should not be attempted when there are unseen commits (from local commands)
            //       or the derive function shall not be allowed to read from other queries that may
            //       have unseen commits (from local commands).
            await this._deriveQueryResultFromOther(query, token);
        }
    }

    // TODO: Move to InternalQuery
    private _tryPopulateQueryFromClone(
        query: InternalQuery,
    ) {
        // Look for another observed query instance with the same key
        const source = this._findFirstQueryClone(query);
        if (!source) {
            return false;
        }

        // Instances that does not have a version token are either hollow or are derived from other queries locally,
        // we don't want to (and cannot) populate from such a clone.
        const version = source.version;
        if (!version) {
            return false;
        }

        // TODO: This should not be attempted when clone has unseen commits (from local commands)
        //       -or- we must support cloning of those commands

        const snapshot = source.pub.tryBuildSnapshot();
        if (snapshot === undefined) {
            return false;
        }

        query.applySnapshot(snapshot, version);
        return true;
    }

    // TODO: Move to InternalQuery
    private _findFirstQueryClone(
        query: InternalQuery,
    ): InternalQuery | null {
        const instances = this._observedQueries.get(query.key)!;

        for (const other of instances) {
            if (other !== query) {
                return other;
            }
        }

        return null;
    }

    // TODO: Move to InternalQuery
    private async _tryPopulateQueryFromStore(
        query: InternalQuery,
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        return !!query && !!token; // dummy
    }

    // TODO: Move to InternalQuery
    private async _deriveQueryResultFromOther(
        query: InternalQuery,
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        return !!query && !!token; // dummy
    }
}
