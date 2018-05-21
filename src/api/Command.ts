import {
    App,
    AppObject,
    ReadonlyJsonValue,
} from "../api";

import {
    internalOf,
} from "../internal";

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets the committed version token that was assigned by the backend when this command was accepted; or null when
     * the command is not accepted.
     *
     * Version tokens can be compared lexicographically to determine casuality; whether one version 'happened before'
     * another version. Other than this property, applications should consider version tokens to be opaque data.
     */
    public get commitVersion(): string | null {
        return internalOf(this).commitVersion;
    }

    /**
     * Gets a descriptor (a json value) that describe this command object.
     */
    public get descriptor(): ReadonlyJsonValue {
        return internalOf(this).descriptor;
    }

    /**
     * Gets a unique command identifier.
     */
    public get id(): string {
        return internalOf(this).id;
    }

    /**
     * Determines whether the command instance is broken. A broken command will never be completed.
     */
    public get isBroken(): boolean {
        return internalOf(this).isBroken;
    }

    /**
     * Determines whether the command has completed.
     *
     * A completed command was either accepted or rejected by the backend.
     */
    public get isCompleted(): boolean {
        return internalOf(this).isCompleted;
    }

    /**
     * Determines whether the command was rejected by the backend.
     */
    public get isRejected(): boolean {
        return internalOf(this).isCompleted;
    }

    /**
     * Creates a descriptor (a json value) that describe this command object.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the app framework.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;
}
