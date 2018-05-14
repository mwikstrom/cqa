import objectHash from "object-hash";

import {
    IJsonArray,
    IJsonObject,
    IReadonlyJsonArray,
    IReadonlyJsonObject,
    JsonValue,
    ReadonlyJsonValue,
} from "../api";

export const DEBUG = process.env.NODE_ENV !== "production";

export const LIB_NAME_SHORT = "cqa";

export const LIB_NAME_LONG = "Command Query App";

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

export const deepEquals = <T>(first: T, second: T): boolean =>
    objectHash(first) === objectHash(second);

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
