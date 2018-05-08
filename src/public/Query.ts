import { reaction } from "mobx";
import objectHash from "object-hash";

import { InternalApp } from "../internal/InternalApp";
import { makeInternalOf } from "../internal/InternalOf";
import { InternalQuery } from "../internal/InternalQuery";

import { App } from "./App";
import { AppObject } from "./AppObject";
import { CancelToken } from "./CancelToken";
import { Command } from "./Command";
import { ReadonlyJsonValue } from "./Json";
import { NotSupportedError } from "./NotSupportedError";
import { Version } from "./Version";

/**
 * Provides a base class for query objects.
 */
export abstract class Query<TApp extends App = App> extends AppObject<TApp> {
    constructor() {
        super();

        // Create a reaction that will automatically register and unregister this instance as active
        let unregister: () => void;
        reaction(
            () => this.isAttached && this.isObserved, // TODO: && !this.isBroken
            active => {
                const query = internalOf(this);
                const app = internalAppOf(this);

                if (active) {
                    unregister = app.registerActiveQuery(query);
                } else if (unregister !== undefined) {
                    unregister();
                }
            },
        );
    }

    /**
     * Gets a descriptor object that completely describe the current query object.
     */
    public get descriptor(): ReadonlyJsonValue {
        return internalOf(this).descriptor;
    }

    /**
     * Determines whether the result of this query object is currently being observed in a reactive context.
     */
    public get isObserved(): boolean {
        return internalOf(this).isObserved;
    }

    /**
     * Gets a unique, and preferably normalized, key string for the current query object.
     */
    public get key(): string {
        return internalOf(this).key;
    }

    /**
     * Determines whether the current query object supports incremental updates.
     *
     * Both {@link Query#onUpdate} and {@link Query#tryBuildSnapshot} must be overridden to support incremental
     * updates.
     */
    public get supportsIncrementalUpdates(): boolean {
        const proto = Object.getPrototypeOf(this);
        return Query.prototype.onUpdate !== proto.onUpdate &&
               Query.prototype.tryBuildSnapshot !== proto.tryBuildSnapshot;
    }

    /**
     * Gets the global version token of the current query result; or `null` when no result is available or when the
     * result is derived from other local queries.
     */
    public get version(): Version | null {
        return internalOf(this).version;
    }

    /**
     * Creates a descriptor object that completely describe the current query object.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;

    /**
     * Creates a unique, and preferably normalized, key string for the current query object.
     */
    public buildKey(): string {
        return objectHash(this.descriptor);
    }

    /**
     * Attempts to derive a result for the current query from other cached queries.
     *
     * @param applySnapshot The callback to invoke to apply a derived snapshot.
     * @param applyUpdate   The callback to invoke to apply an update to a derived snapshot.
     * @param token         A cancel token to be observed while deriving a result.
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
        // Default implementation has no domain knowledge so all commands are ignored.
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

    /**
     * Registers that the result of this query is being observed by the current reactive context.
     */
    public reportObserved(): void {
        internalOf(this).reportObserved();
    }

    /**
     * Attempts to create a readonly result data snapshot for the current query.
     */
    public tryBuildSnapshot(): ReadonlyJsonValue | undefined {
        // Default implementation doesn't know how to build snapshots.
        return undefined;
    }
}

const internalOf = makeInternalOf(Query, InternalQuery);

const appInternalOf = makeInternalOf(App, InternalApp);

const internalAppOf = (pub: Query) => appInternalOf(pub.app);
