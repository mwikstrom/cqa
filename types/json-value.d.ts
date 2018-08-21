/** @public */
export declare type JsonValue = null | boolean | string | number | IJsonArray | IJsonObject;
/** @public */
export interface IJsonArray extends Array<JsonValue> {
}
/** @public */
export interface IJsonObject {
    [name: string]: JsonValue;
}
/** @public */
export declare function isJsonValue(thing: any): thing is JsonValue;
