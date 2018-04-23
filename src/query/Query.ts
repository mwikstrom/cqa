import { AsyncEnumerator } from "../async/AsyncEnumerator";
import { CancelToken } from "../async/CancelToken";
import { View } from "./View";

export abstract class Query<TView extends View = View> {
    /**
     * Gets a unique normalized string that describe the current query.
     */
    public abstract get canonicalQueryString(): string;

    /**
     * Gets the result object for the current query.
     */
    public get result(): TView {
        // TODO: Implement for real!
        return this.createResult();
    }

    public abstract deriveResultFromOtherQueries(
        source: AsyncEnumerator<Query>,
        token: CancelToken,
    ): Promise<TView>;

    protected abstract createResult(): TView;
}
