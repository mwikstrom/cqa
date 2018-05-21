/**
 * Represents a json value
 */
export type JsonValue = JsonPrimitive | IJsonObject | IJsonArray;

/**
 * Represents a json primitive (null, boolean, number or string)
 */
export type JsonPrimitive = null | boolean | number | string;

/**
 * Represents a json object
 */
export interface IJsonObject {
    [name: string]: JsonValue;
}

/**
 * Represents a json array
 */
export interface IJsonArray extends Array<JsonValue> {
}

/**
 * Represents a readonly json value
 */
export type ReadonlyJsonValue = JsonPrimitive | IReadonlyJsonObject | IReadonlyJsonArray;

/**
 * Represents a readonly json object
 */
export interface IReadonlyJsonObject {
    readonly [name: string]: ReadonlyJsonValue;
}

/**
 * Represents a readonly json array
 */
export interface IReadonlyJsonArray extends ReadonlyArray<ReadonlyJsonValue> {
}
