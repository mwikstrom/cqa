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

export interface INamedClass {
    readonly name: string;
}

export const makeCheckThis = (
    ExpectedClass: any,
) => (thisArg: any) => DEBUG && demand(
    thisArg instanceof ExpectedClass,
    `Invalid 'this'-binding, expected instance of '${ExpectedClass.name}'`,
);

export interface IInternalClass<TPublic extends object, TInternal extends InternalOf<TPublic>> {
    new(pub: TPublic): TInternal;
}

export type TInternalOf<TPublic, TInternal> = (
    instance: TPublic,
) => TInternal;

export const makeInternalOf = <TPublic extends object, TInternal extends InternalOf<TPublic>>(
    PublicClass: INamedClass,
    InternalClass: IInternalClass<TPublic, TInternal>,
): TInternalOf<TPublic, TInternal> => {
    const checkThis = makeCheckThis(PublicClass);
    let map = classMap.get(PublicClass) as WeakMap<TPublic, TInternal> | undefined;

    if (map === undefined) {
       classMap.set(PublicClass, map = new WeakMap<TPublic, TInternal>());
    }

    return (pub: TPublic) => {
        checkThis(pub);
        let internal = map!.get(pub);

        if (internal === undefined) {
            map!.set(pub, internal = new InternalClass(pub));
        } else if (DEBUG) {
            demand(
                internal instanceof InternalClass,
                "Unexpected internal class",
            );
        }

        return internal;
    };
};

export abstract class InternalOf<TPublic extends object> {
    constructor(public readonly pub: TPublic) {}
}

const classMap = new WeakMap<INamedClass, WeakMap<object, object>>();
