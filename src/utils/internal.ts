export interface IInternalClass<TPublic extends object, TInternal extends InternalOf<TPublic>> {
    new(pub: TPublic): TInternal;
}

export type TInternalOf<TPublic, TInternal> = (
    instance: TPublic,
) => TInternal;

export const makeInternalOf = <TPublic extends object, TInternal extends InternalOf<TPublic>>(
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

export abstract class InternalOf<TPublic extends object> {
    constructor(public readonly pub: TPublic) {}
}
