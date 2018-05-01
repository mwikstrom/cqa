import { computed } from "mobx";

import { App } from "./App";
import { AppObject } from "./AppObject";
import { CancelToken } from "./CancelToken";
import { Command } from "./Command";
import { ReadonlyJsonValue } from "./Json";
import { NotSupportedError } from "./NotSupportedError";

/**
 * Provides a base class for query objects.
 */
export abstract class Query<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a descriptor object that completely describe the current query object.
     */
    @computed
    public get descriptor(): ReadonlyJsonValue {
        return this.buildDescriptor();
    }

    /**
     * Gets a unique, and preferably normalized, key string for the current query object.
     */
    @computed
    public get key(): string {
        return this.buildKey();
    }

    /**
     * Attempts to derive a result for the current query from other cached queries.
     *
     * @param applySnapshot The callback to invoke to apply a derived snapshot.
     * @param applyUpdate   The callback to invoke to apply an update to a derived snapshot.
     * @param token         A cancel token to be observed while deriving a result. This token is cancelled in case a
     *                      server result is available before a local result is derived.
     */
    public async deriveLocalResult(
        // @ts-ignore: Parameter is declared but not used in the default implementation
        applySnapshot: (data: ReadonlyJsonValue) => void,
        // @ts-ignore: Parameter is declared but not used in the default implementation
        applyUpdate: (data: ReadonlyJsonValue) => void,
        // @ts-ignore: Parameter is declared but not used in the default implementation
        token: CancelToken,
    ): Promise<void> {
        // Default implementation is a no-op because we have no domain knowledge.
    }

    /**
     * Creates a descriptor object that completely describe the current query object.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;

    /**
     * Creates a unique, and preferably normalized, key string for the current query object.
     */
    public buildKey(): string {
        return "..."; // TODO: Implement Query#buildKey
    }

    /**
     * Creates a readonly result data snapshot for the current query.
     */
    public abstract buildSnapshot(): ReadonlyJsonValue;

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
    public onCommand(
        // @ts-ignore: Parameter is declared but not used in the default implementation
        command: Command,
    ): boolean {
        // Default implementation is a no-op because we have no domain knowledge.
        return false;
    }

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
    public onUpdate(
        // @ts-ignore: Parameter is declared but not used in the default implementation
        data: ReadonlyJsonValue,
    ): void {
        throw new NotSupportedError();
    }
}
