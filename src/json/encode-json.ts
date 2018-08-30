import { JsonValue } from "../api/json-value";

/** @internal */
export function encodeJson(
    value: JsonValue,
): Uint8Array {
    const encoder = new TextEncoder();
    const str = JSON.stringify(value);
    return encoder.encode(str);
}
