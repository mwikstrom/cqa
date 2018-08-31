import { JsonValue } from "./json-value";

/** @public */
export type JsonPatch = JsonPatchOperation[];

/** @public */
export type JsonPatchOperation =
    IJsonAddOperation |
    IJsonRemoveOperation |
    IJsonReplaceOperation |
    IJsonMoveOperation |
    IJsonCopyOperation |
    IJsonTestOperation;

/** @public */
export type JsonOperationType =
    "add" |
    "remove" |
    "replace" |
    "move" |
    "copy" |
    "test";

/** @public */
export interface IJsonOperation {
    op: JsonOperationType;
    path: string;
}

/** @public */
export interface IJsonAddOperation extends IJsonOperation {
    op: "add";
    value: JsonValue;
}

/** @public */
export interface IJsonRemoveOperation extends IJsonOperation {
    op: "remove";
}

/** @public */
export interface IJsonReplaceOperation extends IJsonOperation {
    op: "replace";
    value: JsonValue;
}

/** @public */
export interface IJsonMoveOperation extends IJsonOperation {
    op: "move";
    from: string;
}

/** @public */
export interface IJsonCopyOperation extends IJsonOperation {
    op: "copy";
    from: string;
}

/** @public */
export interface IJsonTestOperation extends IJsonOperation {
    op: "test";
    value: JsonValue;
}
