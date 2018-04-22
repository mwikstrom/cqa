import { AsyncEnumerator } from "../async/AsyncEnumerator";
import { CancelToken } from "../async/CancelToken";
import { ReadonlyJsonValue } from "../utils/json";
import { Query } from "./Query";
import { Result } from "./Result";

export abstract class ResultBuilder<TResult extends Result = Result> {
    /**
     * Gets the result object being built.
     */
    public get result(): TResult {
        // TODO: Implement for real!
        return this.createResult();
    }

    public abstract applyCommand(
        target: string,
        type: string,
        data: ReadonlyJsonValue,
    ): boolean;

    public abstract applyCache(
        cache: AsyncEnumerator<Query>,
        token: CancelToken,
    ): Promise<boolean>;

    public abstract applySnapshot(
        data: ReadonlyJsonValue,
    ): void;

    public abstract applyUpdate(
        type: string,
        data: ReadonlyJsonValue,
    ): void;

    public abstract createSnapshot(): ReadonlyJsonValue;

    protected abstract createResult(): TResult;
}
