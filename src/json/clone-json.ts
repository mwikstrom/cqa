import { JsonValue } from "../api/json-value";

/** @internal */
export function cloneJson(
    input: JsonValue,
): JsonValue {
    return JSON.parse(JSON.stringify(input));
}
