import { JsonValue } from "../api/json-value";

/** @internal */
export function decodeJson(
    data: ArrayBuffer,
): JsonValue {
    const decoder = new TextDecoder();
    const str = decoder.decode(data);
    return JSON.parse(str);
}
