import objectHash from "object-hash";

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

export const deepEquals = <T>(first: T, second: T): boolean => objectHash(first) === objectHash(second);
