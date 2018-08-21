import * as t from "io-ts";

/** @public */
export type JsonValue = null | boolean | string | number | IJsonArray | IJsonObject;

/** @public */
export interface IJsonArray extends Array<JsonValue> {}

/** @public */
export interface IJsonObject {
    [name: string]: JsonValue;
}

/** @public */
export function isJsonValue(
    thing: any,
): thing is JsonValue {
    return JsonValueType.decode(thing).isRight();
}

/** @internal */
export const JsonValueType = new t.Type<JsonValue, any, any>(
    "json value",
    is,
    validate,
    t.identity,
);

const JsonObjectType = t.dictionary(t.string, JsonValueType);

const JsonArrayType = t.array(JsonValueType);

function is(
    thing: any,
): thing is JsonValue {
    return validate(thing, []).isRight();
}

function validate(
    input: any,
    context: t.Context,
): t.Validation<JsonValue> {
    switch (typeof input) {
        case "boolean":
        case "string":
            return t.success(input);

        case "number":
            return isFinite(input) ? t.success(input) : t.failure(input, context);

        case "object":
            break;

        default:
            return t.failure(input, context);
    }

    if (input === null || JsonArrayType.is(input)) {
        return t.success(input);
    }

    if (Object.getPrototypeOf(input) === Object.prototype) {
        return JsonObjectType.validate(input, context);
    }

    return t.failure(input, context);
}
