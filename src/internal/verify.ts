import * as t from "io-ts";

export function verify<T extends t.Type<any>>(
    what: string,
    given: t.TypeOf<T>,
    required: T,
): void {
    const result = required.validate(given, []);

    if (result.isLeft()) {
        throw new Error([
            `Invalid ${what}`,
            ...result.value.map(format),
        ].join(". ") + ".");
    }
}

function format(
    error: t.ValidationError,
): string {
    const path = error.context.map(context => context.key).filter(key => !!key).join("/");
    const expected = error.context.slice(-1).map(context => context.type.name)[0];

    if (expected === "never" && path) {
        return `Unexpected ${path}`;
    }

    let result = `Expected ${expected}`;

    // istanbul ignore else
    if (path) {
        result += ` in ${path}`;
    }

    return result;
}
