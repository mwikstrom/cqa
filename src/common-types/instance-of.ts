import * as t from "io-ts";

/** @internal */
export function InstanceOf<
    TClass extends { new (...args: TArgs): TInstance },
    TArgs extends any[],
    TInstance extends object
>(
    constructor: TClass,
) {
    const test = (thing: any): thing is TClass => thing instanceof constructor;
    return new t.Type<TClass>(
        constructor.name,
        test,
        (obj, context) => test(obj) ? t.success(obj) : t.failure(obj, context),
        t.identity,
    );
}
