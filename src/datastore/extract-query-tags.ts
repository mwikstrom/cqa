import * as t from "io-ts";
import { IJsonObject, JsonValue } from "../api/json-value";
import { JsonValueType } from "../json/json-value-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";

/** @internal */
export function extractQueryTags(
    input: IJsonObject,
): JsonValue[][] {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(JsonValueType.is(input));
        assert(typeof input === "object" && input !== null && !Array.isArray(input));
    }

    const output: JsonValue[][] = [];

    Object.keys(input).forEach(key => {
        extractNestedQueryTags(input[key], [ key ]).forEach(tag => output.push(tag));
    });

    return output;
}

function extractNestedQueryTags(
    input: JsonValue,
    scope: JsonValue[],
): JsonValue[][] {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(JsonValueType.is(input));
        assert(t.array(JsonValueType).is(scope));
    }

    const output: JsonValue[][] = [];

    if (input === null || typeof input !== "object") {
        output.push([...scope, input]);
    } else if (Array.isArray(input)) {
        const nested = [...scope, []];
        input.forEach(
            value => extractNestedQueryTags(value, nested).forEach(tag => output.push(tag)),
        );
    } else {
        const nested = [...scope, {}];
        Object.keys(input).forEach(
            key => extractNestedQueryTags(input[key], [...nested, key ]).forEach(tag => output.push(tag)),
        );
    }

    return output;
}
