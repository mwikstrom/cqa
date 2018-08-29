import * as t from "io-ts";

/** @internal */
export function RegExpMatch(pattern: RegExp): t.Type<string> {
    return t.refinement(
        t.string,
        value => pattern.test(value),
        `string matching ${pattern}`,
    );
}
