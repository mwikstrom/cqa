import { AsyncEnumerator } from "../async/AsyncEnumerator";
import { CancelToken } from "../async/CancelToken";
import { ReadonlyJsonValue } from "../utils/json";
import { View } from "./View";

/**
 * Represents a query.
 */
export abstract class Query<TView extends View = View> {
    /**
     * Gets a unique normalized key string for the current query.
     */
    public abstract get cacheKey(): string;

    /**
     * Gets a data object that completely describe the current query.
     */
    public abstract get queryData(): ReadonlyJsonValue;

    /**
     * Gets the result view for the current query.
     */
    public get result(): TView {
        // TODO: Implement for real!
        return this.createResult();
    }

    /**
     * Attempts to create an approximate result view derived from the results of other queries that are cached locally.
     *
     * @param source An enumerator of queries that are available locally.
     * @param token  A cancel token to be observed while deriving a result. The token is cancelled in case
     *               a server result is available before completion of this method.
     *
     * @returns A result view for the current query when it could be derived from the results of other queries;
     *          or `undefined` otherwise.
     */
    public abstract approximateResultFromOtherQueries(
        source: AsyncEnumerator<Query>,
        token: CancelToken,
    ): Promise<TView | undefined>;

    /**
     * Creates a new hollow result view for the current query.
     */
    protected abstract createResult(): TView;
}
