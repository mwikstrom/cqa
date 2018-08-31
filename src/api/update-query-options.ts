import { JsonPatch } from "./json-patch";

/** @public */
export interface IUpdateQueryOptions {
    commitBefore: string;
    commitAfter: string;
    patch?: JsonPatch;
}
