import {
    Command,
    Query,
    ReadonlyJsonValue,
} from "../api";

import { internalOf } from "../internal";

/**
 * Command Query App root object
 */
export class App {
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

    // TODO: Add `public execute(command: Command)` function
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
