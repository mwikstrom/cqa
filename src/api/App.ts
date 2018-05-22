import {
    Command,
    IAppOptions,
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
     * Initializes a new app instance.
     *
     * @param options Optional configuration options to be applied to the new instance.
     */
    constructor(options?: IAppOptions) {
        if (options) {
            this.configure(options);
        }
    }

    /**
     * Gets the console that the app uses for diagnostic messages
     */
    public get console(): ISimpleConsole {
        return internalOf(this).console;
    }

    /**
     * Gets a unique app instance identifier.
     *
     * The identifier is auto-generated and immutable.
     */
    public get instanceId(): string {
        return internalOf(this).instanceId;
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
     * Applies the specified configuration options to the current app instance.
     */
    public configure(options: IAppOptions): this {
        internalOf(this).configure(options);
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
