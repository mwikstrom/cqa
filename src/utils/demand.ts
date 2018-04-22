import { LIB_NAME_SHORT } from "./const";

export interface IErrorClass {
    new (message: string): Error;
}

export const demand = (
    condition: boolean,
    message: string = "Invalid operation",
    errorClass: IErrorClass = Error,
) => {
    if (!condition) {
        throw new errorClass(
            `[${LIB_NAME_SHORT}]: ${message}`,
        );
    }
};
