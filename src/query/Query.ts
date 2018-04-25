import { App, AppObject } from "../app";
import { CancelToken } from "../async/CancelToken";
import { ReadonlyJsonValue } from "../utils/json";
import { View } from "./View";

/**
 * Represents a query.
 */
export abstract class Query<TView extends View = View, TApp extends App = App> extends AppObject<TApp> {
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
        return this.createHollowResult();
    }

    /**
     * Attempts to derive a result for the current query from other cached query results.
     *
     * @param onSnapshot The callback to invoke to apply a derived snapshot.
     * @param onUpdate The callback to invoke to apply an update to a derived snapshot.
     * @param token A cancel token to be observed while deriving a result. This token is cancelled in case a server
     *              result is available before a local result is derived.
     */
    public abstract deriveLocalResult(
        onSnapshot: (data: ReadonlyJsonValue) => void,
        onUpdate: (data: ReadonlyJsonValue) => void,
        token: CancelToken,
    ): Promise<void>;

    /**
     * Creates a new hollow result view for the current query.
     */
    protected abstract createHollowResult(): TView;
}
