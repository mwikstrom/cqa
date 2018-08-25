/** @public */
export type JsonValue = null | boolean | string | number | IJsonArray | IJsonObject;

/** @public */
export interface IJsonArray extends Array<JsonValue> {}

/** @public */
export interface IJsonObject {
    [name: string]: JsonValue;
}
