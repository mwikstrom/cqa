import { JsonValueType } from "../json/json-value-type";
import { JsonValue } from "./json-value";

/** @public */
export function isJsonValue(
    thing: any,
): thing is JsonValue {
    return JsonValueType.is(thing);
}
