import { demand } from "./demand";

export interface INamedClass {
    readonly name: string;
}

export const makeCheckThis = (
    ExpectedClass: any,
) => (thisArg: any) => demand(
    thisArg instanceof ExpectedClass,
    `Invalid 'this'-binding, expected instance of '${ExpectedClass.name}'`,
);
