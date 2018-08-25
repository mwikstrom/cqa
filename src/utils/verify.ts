import * as t from "io-ts";

const verificationMap = new WeakMap();

/** @internal */
export function verify<T extends t.Type<any>>(
    what: string,
    given: any,
    required: T,
): void {
    const result = required.validate(given, []);

    if (result.isLeft()) {
        throw new Error([
            `Invalid ${what}`,
            ...result.value.map(formatError).filter(error => !!error),
        ].join(". ") + ".");
    }
}

/** @internal */
export function withVerification<
    TFunc extends (...args: TArgs) => TResult,
    TArgs extends any[],
    TResult
>(
    func: TFunc,
    check: (...args: TArgs) => void,
): TFunc {
    const verified = (...args: TArgs) => {
        check(...args);
        return func(...args);
    };

    verificationMap.set(verified, func);

    return verified as TFunc;
}

/** @internal */
export function unwrapVerifications<T extends { [key: string]: any }>(
    obj: T,
): T {
    const unwrapped: { [key: string]: any } = {};
    let same = true;

    Object.keys(obj).forEach(key => {
        const before = obj[key];
        let after = before;

        if (typeof before === "function") {
            after = withoutVerification(before);
            same = false;
        }

        unwrapped[key] = after;
    });

    return same ? obj : unwrapped as T;
}

/** @internal */
export function withoutVerification<
    TFunc extends (...args: TArgs) => TResult,
    TArgs extends any[],
    TResult
>(
    func: TFunc,
): TFunc {
    let result = func;

    while (true) {
        const unverified = verificationMap.get(result);
        if (unverified) {
            result = unverified;
        } else {
            return result;
        }
    }
}

function formatError(
    error: t.ValidationError,
): string {
    const path = error.context.map(context => context.key).filter(key => !!key).join("/");
    const expected = error.context.slice(-1).map(context => context.type.name)[0];

    if (!expected || expected === "never") {
        // istanbul ignore next
        return path ? `Unexpected ${path}` : "";
    }

    let result = `Expected ${expected}`;

    // istanbul ignore else
    if (path) {
        result += ` in ${path}`;
    }

    return result;
}
