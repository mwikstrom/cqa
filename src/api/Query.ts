import { reaction } from "mobx";

import {
    App,
    AppObject,
    CancelToken,
    Command,
    NotSupportedError,
    ReadonlyJsonValue,
} from "../api";

import {
    hashOf,
    internalOf,
} from "../internal";

/**
 * Provides a base class for query objects.
 */
export abstract class Query<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a descriptor (a json value) that describe this query object.
     */
    public get descriptor(): ReadonlyJsonValue {
        return internalOf(this).descriptor;
    }

    /**
     * Determines whether the current query object is broken because an error occurred.
     */
    public get isBroken(): boolean {
        return internalOf(this).isBroken;
    }

    /**
     * Determines whether the result of this query object is currently being observed in a reactive context.
     */
    public get isObserved(): boolean {
        return internalOf(this).isObserved;
    }

    /**
     * Determines whether the result of this query object is being populated.
     */
    public get isPopulating(): boolean {
        return internalOf(this).isPopulating;
    }

    /**
     * Gets a unique key string for this query.
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
     * result is computed locally.
     *
     * Version tokens can be compared lexicographically to determine casuality; whether one version 'happened before'
     * another version. Other than this property, applications should consider version tokens to be opaque data.
     */
    public get version(): string | null {
        return internalOf(this).version;
    }

    /** @inheritDoc */
    public attachTo(app: TApp) {
        super.attachTo(app);

        // Create a reaction that will automatically register and unregister this instance as active
        let unregister: () => void;
        reaction(
            () => this.isAttached && this.isObserved && !this.isBroken,
            active => {
                if (active) {
                    unregister = internalOf(this.app).registerActiveQuery(internalOf(this));
                } else if (unregister !== undefined) {
                    unregister();
                }
            },
            {
                fireImmediately: true,
                name: `Track active query (key=${this.key})`,
            },
        );

        return this;
    }

    /**
     * Creates a descriptor (a json value) that describe this query object.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;

    /**
     * Creates a unique key string for this query.
     *
     * The default implementation creates a key based on the query descriptor.
     */
    public buildKey(): string {
        return hashOf(this.descriptor);
    }

    /**
     * Attempts to compute a result for the current query from other cached queries and recently executed
     * commands.
     *
     * @param applySnapshot The callback to invoke to apply a computed snapshot.
     * @param applyUpdate   The callback to invoke to apply an update to a computed snapshot.
     * @param token         A cancel token to be observed while deriving a result.
     */
    public async compute(
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
     * Determines whether the specified command may effect the result of the current query.
     *
     * The app framework uses this function to determine which commands that must be tracked and applied by calling
     * {@link Query.onCommand}.
     *
     * @param command The command to test
     */
    public mayAffectResult(
        // @ts-ignore: Parameter is declared but not used in the default implementation
        command: Command,
    ): boolean {
        // Default implementation has no domain knowledge so all commands are ignored.
        return false;
    }

    /**
     * Applies the effect of the specified command to the result of the current query.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     *
     * @param command The command to be applied
     *
     */
    public onCommand(
        // @ts-ignore: Parameter is declared but not used in the default implementation
        command: Command,
    ): void {
        throw new NotSupportedError();
    }

    /**
     * Resets the result of the current query.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     */
    public abstract onReset(): void;

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
    public reportObserved(): this {
        internalOf(this).reportObserved();
        return this;
    }

    /**
     * Reset the result of the current query.
     */
    public reset(): this {
        internalOf(this).reset();
        return this;
    }

    /**
     * Attempts to create a readonly result data snapshot for the current query.
     */
    public tryBuildSnapshot(): ReadonlyJsonValue | undefined {
        // Default implementation doesn't know how to build snapshots.
        return undefined;
    }
}
