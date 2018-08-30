import { JsonValue } from "../api/json-value";
import { encodeJson } from "./encode-json";
import { makeCanonicalJson } from "./make-canonical-json";

/** @internal */
export async function computeJsonHash(
    input: JsonValue,
): Promise<ArrayBuffer> {
    const canonical = makeCanonicalJson(input);
    const data = encodeJson(canonical);
    return await crypto.subtle.digest({ name: "SHA-1" }, data);
}
