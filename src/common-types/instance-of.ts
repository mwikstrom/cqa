import * as t from "io-ts";

const cache = new WeakMap();

/** @internal */
export function InstanceOf<
    TConstructor extends { new (...args: TArgs): TClass },
    TArgs extends any[],
    TClass extends object,
>(
    constructor: TConstructor,
): t.Type<TClass> {
    let type = cache.get(constructor);

    if (!type) {
        const test = (thing: any): thing is TConstructor => thing instanceof constructor;

        type = new t.Type<TConstructor>(
            constructor.name,
            test,
            (obj, context) => test(obj) ? t.success(obj) : t.failure(obj, context),
            t.identity,
        );

        cache.set(constructor, type);
    }

    return type;
}
