import {
    Command,
    ISimpleConsole,
    Query,
    ReadonlyJsonValue,
} from "../api";

import { internalOf } from "../internal";

/**
 * Command Query App root object
 */
export class App {
    /**
     * Gets a console that the app use for diagnostic messages
     */
    public get console(): ISimpleConsole {
        return internalOf(this).console;
    }

    /**
     * Sets a console that the app shall use for diagnostic messages
     */
    public set console(value: ISimpleConsole) {
        internalOf(this).console = value;
    }

    /**
     * Gets a unique command identifier.
     */
    public get id(): string {
        return internalOf(this).id;
    }

    /**
     * Determines whether the local realm value is locked.
     */
    public get isLocalRealmLocked() {
        return internalOf(this).isLocalRealmLocked;
    }

    /**
     * Gets the local realm of the current app instance.
     *
     * The local realm is a string that provides a namespace for locally shared resources.
     */
    public get localRealm(): string {
        return internalOf(this).localRealm;
    }

    /**
     * Sets the local realm of the current app instance.
     *
     * The local realm is a string that provides a namespace for locally shared resources.
     */
    public set localRealm(value: string) {
        internalOf(this).localRealm = value;
    }

    /**
     * Locks the local realm of the current app instance and returns the locked value.
     *
     * The local realm is a string that provides a namespace for locally shared resources.
     */
    public get lockedLocalRealm(): string {
        return internalOf(this).lockedLocalRealm;
    }

    /**
     * Sets the local realm of the current app instance and locks it.
     *
     * The local realm is a string that provides a namespace for locally shared resources.
     */
    public set lockedLocalRealm(value: string) {
        internalOf(this).lockedLocalRealm = value;
    }

    /**
     * Registers that the specified factory function shall be used to construct {@link Command} instances.
     *
     * @param factory The factory function to be registered
     */
    public addCommandFactory(factory: CommandFactory): this {
        internalOf(this).addCommandFactory(factory);
        return this;
    }

    /**
     * Registers that the specified factory function shall be used to construct {@link Command} instances.
     *
     * @param factory The factory function to be registered
     */
    public addQueryFactory(factory: QueryFactory): this {
        internalOf(this).addQueryFactory(factory);
        return this;
    }

    /**
     * Creates a {@link Command} instance for the specified descriptor
     *
     * @param descriptor A data object that describe the command to be constructed
     */
    public createCommand(
        descriptor: ReadonlyJsonValue,
    ): Command {
        return internalOf(this).createCommand(descriptor);
    }

    /**
     * Creates a {@link Query} instance for the specified descriptor
     *
     * @param descriptor A data object that describe the query to be constructed
     */
    public createQuery(
        descriptor: ReadonlyJsonValue,
    ): Query {
        return internalOf(this).createQuery(descriptor);
    }

    /**
     * Begins executing the specified command
     *
     * @param descriptor A data object that describe the command to be executed.
     * @returns The constructed command that is being executed
     */
    public execute(descriptor: ReadonlyJsonValue): Command;

    /**
     * Begins executing the specified command
     *
     * @param command The command to be executed
     */
    public execute<T extends Command>(command: T): T;

    public execute(
        descriptorOrCommand: ReadonlyJsonValue | Command,
    ): Command {
        const command =
            descriptorOrCommand instanceof Command ?
            descriptorOrCommand.attachTo(this) :
            this.createCommand(descriptorOrCommand);

        internalOf(this).execute(internalOf(command));

        return command;
    }

    /**
     * Sets the local realm value and returns the current instance.
     */
    public withLocalRealm(value: string): this {
        this.localRealm = value;
        return this;
    }

    /**
     * Locks and sets the local realm value and returns the current instance.
     */
    public withLockedLocalRealm(value: string): this {
        this.lockedLocalRealm = value;
        return this;
    }
}

/**
 * Creates a new {@link Command} instance for the specified descriptor.
 */
export type CommandFactory = (
    descriptor: ReadonlyJsonValue,
) => Command | undefined;

/**
 * Creates a new {@link Query} instance for the specified descriptor.
 *
 * The optional key parameter is supplied when queries are restored from the local cache.
 */
export type QueryFactory = (
    descriptor: ReadonlyJsonValue,
    key?: string,
) => Query | undefined;
