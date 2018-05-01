import { demand } from "./Demand";

export interface INamedClass {
    readonly name: string;
}

export const makeCheckThis = (
    ExpectedClass: any,
) => (thisArg: any) => process.env.NODE_ENV === "production" && demand(
    thisArg instanceof ExpectedClass,
    `Invalid 'this'-binding, expected instance of '${ExpectedClass.name}'`,
);

export interface IInternalClass<TPublic extends object, TInternal extends InternalOf<TPublic>> {
    new(pub: TPublic): TInternal;
}

export type TInternalOf<TPublic, TInternal> = (
    instance: TPublic,
) => TInternal;

export const makeUncheckedInternalOf = <TPublic extends object, TInternal extends InternalOf<TPublic>>(
    InternalClass: IInternalClass<TPublic, TInternal>,
): TInternalOf<TPublic, TInternal> => {
    const map = new WeakMap<TPublic, TInternal>();
    return (pub: TPublic) => {
        let internal = map.get(pub);

        if (internal === undefined) {
            map.set(pub, internal = new InternalClass(pub));
        }

        return internal;
    };
};

export const makeInternalOf = <TPublic extends object, TInternal extends InternalOf<TPublic>>(
    PublicClass: INamedClass,
    InternalClass: IInternalClass<TPublic, TInternal>,
): TInternalOf<TPublic, TInternal> => {
    const checkThis = makeCheckThis(PublicClass);
    const uncheckedInternalOf = makeUncheckedInternalOf(InternalClass);
    return (pub: TPublic) => {
        checkThis(pub);
        return uncheckedInternalOf(pub);
    };
};

export abstract class InternalOf<TPublic extends object> {
    constructor(public readonly pub: TPublic) {}
}
