import { App } from "./App";
import { AppObject } from "./AppObject";
import { CancelToken } from "./CancelToken";
import { Command } from "./Command";
import { ReadonlyJsonValue } from "./Json";

/**
 * Provides a base class for query objects.
 */
export abstract class Query<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a descriptor object that completely describe the current query object.
     */
    public abstract get descriptor(): ReadonlyJsonValue;

    /**
     * Gets a unique, and preferably normalized, key string for the current query object.
     */
    public abstract get key(): string; // TODO: Provide default impl

    /**
     * Attempts to derive a result for the current query from other cached queries.
     *
     * @param onSnapshot    The callback to invoke to apply a derived snapshot.
     * @param onUpdate      The callback to invoke to apply an update to a derived snapshot.
     * @param token         A cancel token to be observed while deriving a result. This token is cancelled in case a
     *                      server result is available before a local result is derived.
     */
    public abstract deriveLocalResult(
        onSnapshot: (data: ReadonlyJsonValue) => void,
        onUpdate: (data: ReadonlyJsonValue) => void,
        token: CancelToken,
    ): Promise<void>;

    /**
     * Creates a readonly result data snapshot for the current query.
     */
    public abstract createSnapshot(): ReadonlyJsonValue;

    /**
     * Applies the effect of the specified command to the result of the current query.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     *
     * @param command The command to be applied
     *
     * @returns `true` when the specified command did or may have an effect on the result of the current query;
     *          otherwise `false`.
     */
    public abstract onCommand(
        command: Command,
    ): boolean;

    /**
     * Applies the specified snapshot to the current query result. It is assumed that the information set provided by
     * the current query result is completely reset by the specified snapshot.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     *
     * @param data The snapshot data to be applied.
     */
    public abstract onSnapshot(
        data: ReadonlyJsonValue,
    ): void;

    /**
     * Applies the specified update to the current query result.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     *
     * @param data The update data to be applied.
     */
    public abstract onUpdate(
        data: ReadonlyJsonValue,
    ): void;
}
