import { App } from "../public/App";
import { CancelToken } from "../public/CancelToken";
import { CancelTokenSource } from "../public/CancelTokenSource";

import { demand } from "./Demand";
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

        // Verify that each query instance is registered only once
        if (process.env.NODE_ENV !== "production") {
            demand(!instances.has(query));
        }

        const cts = new CancelTokenSource();

        // Add registered instance and start executing query on backend if it is the first instance
        instances.add(query);
        if (instances.size === 1) {
            // TODO: Execute query on backend. Cancel token source when first snapshot arrives.
        }

        // TODO: Must delay backend execution until query was populated locally so that we have a chance to get
        //       catch-up deltas instead of a full initial snapshot.

        cts.token.ignoreCancellation(this._populateQueryLocally(query, cts.token));

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

    private async _populateQueryLocally(
        query: InternalQuery,
        token: CancelToken,
    ) {
        // TODO: This should not be attempted when clone has unseen commits (from local commands)
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

    private _tryPopulateQueryFromClone(
        query: InternalQuery,
    ) {
        const source = this._findFirstQueryClone(query);
        if (!source) {
            return false;
        }

        const version = source.version;
        if (!version) {
            return false;
        }

        const snapshot = source.pub.buildSnapshot();
        query.applySnapshot(snapshot, version);

        return true;
    }

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

    private async _tryPopulateQueryFromStore(
        query: InternalQuery,
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        return !!query && !!token; // dummy
    }

    private async _deriveQueryResultFromOther(
        query: InternalQuery,
        token: CancelToken,
    ): Promise<boolean> {
        // TODO: IMPLEMENT
        return !!query && !!token; // dummy
    }
}
