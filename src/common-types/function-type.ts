import * as t from "io-ts";

/** @internal */
export function FunctionType<T extends (...args: any[]) => any>(): t.Type<T> {
    const FunctionTypeClass = class extends t.Type<T> {
        constructor() {
            super(
                "Function",
                (m): m is T => typeof m === "function",
                (m, c) => (this.is(m) ? t.success(m) : t.failure(m, c)),
                t.identity,
            );
        }
    };

    return new FunctionTypeClass();
}
