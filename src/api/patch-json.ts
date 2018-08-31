import { cloneJson } from "../json/clone-json";
import { patchJsonInPlace } from "../json/patch-json-in-place";
import { JsonPatch } from "./json-patch";
import { JsonValue } from "./json-value";

/** @internal */
export function patchJson(
    input: JsonValue,
    patch: JsonPatch,
): JsonValue {
    const clone = cloneJson(input);
    return patchJsonInPlace(clone, patch);
}
