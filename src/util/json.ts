export type JsonValue = JsonPrimitive | IJsonObject | IJsonArray;

export type JsonPrimitive = null | boolean | number | string;

export interface IJsonObject {
    [name: string]: JsonValue;
}

export interface IJsonArray extends Array<JsonValue> {
}

export type ReadonlyJsonValue = JsonPrimitive | IReadonlyJsonObject | IReadonlyJsonArray;

export interface IReadonlyJsonObject {
    readonly [name: string]: ReadonlyJsonValue;
}

export interface IReadonlyJsonArray extends ReadonlyArray<ReadonlyJsonValue> {
}
