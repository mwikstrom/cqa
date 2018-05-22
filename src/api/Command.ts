import {
    App,
    AppObject,
    ReadonlyJsonValue,
} from "../api";

import {
    internalOf,
} from "../internal";

/**
 * Provides a base class for commands
 */
export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets the committed version token that was assigned by the backend when this command was accepted; or null when
     * the command is not accepted.
     *
     * Version tokens can be compared lexicographically to determine casuality; whether one version 'happened before'
     * another version. In all other aspects version tokens should be considered as opaque data.
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
     * Gets a globally unique identifier for this command instance.
     *
     * The global identifier is auto-generated and immutable.
     */
    public get globalId(): string {
        return internalOf(this).globalId;
    }

    /**
     * Gets a local identifier for this command instance; or null when the command has not been stored locally.
     *
     * The local identifier is assigned automatically when the command is executed and thereby stored locally.
     * Local identifiers are unique among all app instances that use the same qualified local realm and are incremented
     * whenever a new command is stored. Therefore it is possible to use the local identifiers of two command instances
     * to determine the order in which they were executed.
     */
    public get localId(): number | null {
        return internalOf(this).localId;
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
