import objectHash from "object-hash";
import uuid from "uuid/v4";

import {
    IJsonArray,
    IJsonObject,
    IReadonlyJsonArray,
    IReadonlyJsonObject,
    ISimpleConsole,
    JsonValue,
    ReadonlyJsonValue,
} from "../api";

export const DEBUG = process.env.NODE_ENV !== "production";

export const LIB_NAME_SHORT = "cqa";

export const LIB_NAME_LONG = "Command Query App";

export const SILENT_CONSOLE: ISimpleConsole = Object.freeze({
    warn: () => { /* no-op */ },
});

export const RESOLVED = new Promise(resolve => resolve());

export interface IParamlessErrorClass {
    new(): Error;
}

export const demand = (
    condition: boolean,
    error: string | IParamlessErrorClass = "Invalid operation",
): void => {
    if (condition) {
        return;
    }

    if (typeof error === "string") {
        throw new Error(error);
    }

    throw new error();
};

export const invariant = (
    condition: boolean,
    message: string,
): void => demand(
    condition,
    `[${LIB_NAME_SHORT}] broken invariant: ${message}`,
);

export const deepEquals = (
    first: JsonValue | ReadonlyJsonValue,
    second: JsonValue | ReadonlyJsonValue,
): boolean => hashOf(first) === hashOf(second);

export const isPrimitive = (value: JsonValue | ReadonlyJsonValue): value is null | string | number | boolean =>
    value === null ||
    /^(string|number|boolean)$/.test(typeof value);

const makeDeepFrozenArrayClone = (value: IJsonArray | IReadonlyJsonArray): IReadonlyJsonArray =>
    Object.freeze((value as Array<JsonValue | ReadonlyJsonValue>).map(freezeDeep));

const makeDeepFrozenObjectClone = (value: IJsonObject | IReadonlyJsonObject): IReadonlyJsonObject => {
    const clone: { [name: string]: ReadonlyJsonValue } = {};

    Object.keys(value).forEach(key => {
        clone[key] = freezeDeep(value[key]);
    });

    return Object.freeze(clone);
};

const makeDeepFrozenClone = (
    value: IJsonArray | IJsonObject | IReadonlyJsonArray | IReadonlyJsonObject,
): IReadonlyJsonArray | IReadonlyJsonObject =>
    Array.isArray(value) ?
    makeDeepFrozenArrayClone(value) :
    makeDeepFrozenObjectClone(value as IJsonObject | IReadonlyJsonObject);

const deepFrozenThings = new WeakSet<IReadonlyJsonArray | IReadonlyJsonObject>();
export const freezeDeep = (value: JsonValue | ReadonlyJsonValue): ReadonlyJsonValue => {
    if (isPrimitive(value) || deepFrozenThings.has(value)) {
        return value;
    }

    const frozen = makeDeepFrozenClone(value);
    deepFrozenThings.add(frozen);

    return frozen;
};
export const freezeDeepIfDefined = (value: JsonValue | ReadonlyJsonValue | undefined): ReadonlyJsonValue | undefined =>
    value === undefined ? value : freezeDeep(value);

const urlEncodeBase64 = (base64: string) =>
    base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const computeHash = (value: any) =>
    urlEncodeBase64(objectHash(value, { encoding: "base64" }));

const deepFrozenHashes = new WeakMap<IReadonlyJsonArray | IReadonlyJsonObject, string>();
export const hashOf = (value: JsonValue | ReadonlyJsonValue) => {
    if (isPrimitive(value) || !deepFrozenThings.has(value)) {
        return computeHash(value);
    }

    let frozenHash = deepFrozenHashes.get(value);
    if (frozenHash === undefined) {
        deepFrozenHashes.set(value, frozenHash = computeHash(value));
    }

    return frozenHash;
};

export const createIdentifier = (byteLength: number = 16): string =>
    urlEncodeBase64(
        btoa(
            String.fromCharCode.apply(
                null,
                uuid(
                    null,
                    new Uint8Array(byteLength),
                ),
            ),
        ),
    );
