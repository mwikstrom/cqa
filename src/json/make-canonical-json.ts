import { IJsonObject, JsonValue } from "../api/json-value";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { JsonValueType } from "./json-value-type";

/** @internal */
export function makeCanonicalJson(
    input: JsonValue,
): JsonValue {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(JsonValueType.is(input));
    }

    if (input === null || typeof input !== "object") {
        return input;
    } else if (Array.isArray(input)) {
        return input.map(makeCanonicalJson);
    } else {
        const sorted: IJsonObject = {};
        Object.keys(input).sort().forEach(key => {
            sorted[key] = makeCanonicalJson(input[key]);
        });
        return sorted;
    }
}
