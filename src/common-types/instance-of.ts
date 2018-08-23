import * as t from "io-ts";

const cache = new WeakMap();

/** @internal */
export function InstanceOf<
    TClass extends { new (...args: TArgs): TInstance },
    TArgs extends any[],
    TInstance extends object
>(
    constructor: TClass,
) {
    let type = cache.get(constructor);

    if (!type) {
        const test = (thing: any): thing is TClass => thing instanceof constructor;

        type = new t.Type<TClass>(
            constructor.name,
            test,
            (obj, context) => test(obj) ? t.success(obj) : t.failure(obj, context),
            t.identity,
        );

        cache.set(constructor, type);
    }

    return type;
}
