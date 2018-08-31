import { JsonValue } from "../api/json-value";

/** @internal */
export function jsonEquals(
    first: JsonValue,
    second: JsonValue,
): boolean {
    if (first === null || typeof first !== "object") {
        return first === second;
    } else if (Array.isArray(first)) {
        if (!Array.isArray(second) || first.length !== second.length) {
            return false;
        } else {
            for (let i = 0; i < first.length; ++i) {
                if (!jsonEquals(first[i], second[i])) {
                    return false;
                }
            }
            return true;
        }
    } else if (typeof second === "object" && second !== null && !Array.isArray(second)) {
        const firstKeys = Object.keys(first);
        const secondKeys = new Set(Object.keys(second));
        return firstKeys.length === secondKeys.size &&
            firstKeys.every(key => secondKeys.has(key) && jsonEquals(first[key], second[key]));
    } else {
        return false;
    }
}
