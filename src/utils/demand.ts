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
