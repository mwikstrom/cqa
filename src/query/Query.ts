import { Result } from "./Result";
import { ResultBuilder } from "./ResultBuilder";

export abstract class Query<TResult extends Result = Result> {
    /**
     * Gets a unique normalized string that describe the current query.
     */
    public abstract get canonicalQueryString(): string;

    /**
     * Gets the result object for the current query.
     */
    public get result(): TResult {
        // TODO: Implement for real!
        return this.createResultBuilder().result;
    }

    protected abstract createResultBuilder(): ResultBuilder<TResult>;
}
