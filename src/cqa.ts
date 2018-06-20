/**
 * CQA - Command Query App
 * Copyright (c) Mårten Wikström 2018, MIT Licensed
 * https://github.com/mwikstrom/cqa
 */

//
// Make sure that we have a `process.env` object. We'll read `NODE_ENV` from that object to distinguish between
// production and non-production (DEBUG) bundles.
//
if (typeof process !== "object") {
    // @ts-ignore
    process = { env: { } };
} else if (typeof process.env !== "object") {
    process.env = {};
}

import {
    DEBUG,
    LIB_NAME_SHORT,
} from "./internal/const";

//
// Print a warning when a DEBUG mode (non-production) bundle is minified.
//
(() => {
    function this_name_shall_be_minified_in_production() { /* no-op */ }

    if (DEBUG && this_name_shall_be_minified_in_production.name !== "this_name_shall_be_minified_in_production") {
        /* tslint:disable-next-line */
        console.warn(`[${LIB_NAME_SHORT}]: you should set 'process.env.NODE_ENV' to 'production' in your bundler.`);
    }
})();

export interface ICommandType<TParam = any> {
    readonly name: string;
    createDefaultParam(): TParam;
}

export interface ICommand<TParam> {
    readonly id: string;
    readonly type: ICommandType<TParam>;
    readonly param: TParam;
}

export interface IDefineCommandOptions<TParam> {
    defaultParam?: TParam | Func<TParam>;
}

export interface IQueryType<TParam = any, TResult = any> {
    readonly name: string;
    createDefaultParam(): TParam;
    createHollowResult(): TResult;
}

export type Func<T> = () => T;

export interface ICommandHandlerBuilder<TQueryParam, TQueryResult> {
    on: CommandHandlerFunc<TQueryParam, TQueryResult>;
}

export type CommandHandlerFunc<TQueryParam, TQueryResult> = <TCommandParam>(
    command: ICommandType<TCommandParam>,
    handler: (
        before: TQueryResult,
        command: ICommand<TCommandParam>,
        query: IQuery<TQueryParam, TQueryResult>,
    ) => TQueryResult,
) => ICommandHandlerBuilder<TQueryParam, TQueryResult>;

export interface IDefineQueryOptions<TParam = any, TResult = any> {
    defaultParam?: TParam | Func<TParam>;
    hollowResult?: TResult | Func<TResult>;
    handleCommands?(on: CommandHandlerFunc<TParam, TResult>): void;
}

export interface IQuery<TParam = any, TResult = any> {
    readonly type: IQueryType<TParam, TResult>;
    readonly param: TParam;
}

export interface IQueryStatus {
    readonly isActive: boolean;
}

export function defineCommand<TParam = any>(
    name: string,
    options?: IDefineCommandOptions<TParam>,
): ICommandType<TParam> {
    // TODO: Implement defineCommand
    throw new Error("Not implemented" + String(name) + String(options));
}

export function createCommand<TParam = any>(
    type: string | ICommandType<TParam>,
    param?: TParam,
): ICommand<TParam> {
    // TODO: Implement createCommand
    const id = "make-unique-id";

    if (typeof type === "string") {
        type = lookupCommandType<TParam>(type);
    }

    if (param === undefined) {
        param = type.createDefaultParam();
    }

    return { id, param, type };
}

export async function tryLookupCommandAsync<TParam = any>(
    id: string,
): Promise<ICommand<TParam> | undefined> {
    // TODO: Implement getCommand
    throw new Error("Not implemented" + String(id));
}

// TODO: interface ICommandCursor

// TODO: function openCommandCursor

// TODO: function getCommandStatus

// TODO: function getFinalCommandStatusAsync

export function lookupCommandType<TParam = any>(
    name: string,
): ICommandType<TParam> {
    // TODO: Implement getCommandType
    throw new Error("Not implemented" + String(name));
}

export function defineQuery<TParam = any, TResult = any>(
    name: string,
    options?: IDefineQueryOptions,
): IQueryType<TParam, TResult> {
    // TODO: Implement defineQuery
    throw new Error("Not implemented" + String(name) + String(options));
}

export function lookupQueryType<TParam = any, TResult = any>(
    name: string,
): IQueryType<TParam, TResult> {
    // TODO: Implement getQueryType
    throw new Error("Not implemented" + String(name));
}

export function createQuery<TParam = any, TResult = any>(
    type: string | IQueryType<TParam, TResult>,
    param?: TParam,
): IQuery<TParam, TResult> {
    // TODO: Implement createQuery

    if (typeof type === "string") {
        type = lookupQueryType<TParam, TResult>(type);
    }

    if (param === undefined) {
        param = type.createDefaultParam();
    }

    return { param, type };
}

export function getQueryResult<TParam = any, TResult = any>(
    query: IQuery<TParam, TResult>,
): TResult {
    // TODO: Implement getQueryResult
    throw new Error("Not implemented" + String(query));
}

export function getQueryStatus<TParam = any, TResult = any>(
    query: IQuery<TParam, TResult>,
): IQueryStatus {
    // TODO: Implement getQueryStatus
    throw new Error("Not implemented" + String(query));
}

// TODO: function openQueryCursor

// TODO: function getLocalQueryResultAsync

// TODO: function getFreshQueryResultAsync
