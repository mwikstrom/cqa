export type JsonValue = null | boolean | string | number | IJsonArray | IJsonObject;

export interface IJsonArray extends Array<JsonValue> {}

export interface IJsonObject {
    [name: string]: JsonValue;
}
