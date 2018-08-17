import { JsonValueType } from "../../internal/json-value-type";
import { JsonValue } from "./typings";

export const isJsonValue = (thing: any): thing is JsonValue => JsonValueType.validate(thing, []).isRight();
