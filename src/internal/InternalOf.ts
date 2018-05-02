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
        } else if (process.env.NODE_ENV !== "production") {
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
