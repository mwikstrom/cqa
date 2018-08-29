import objectHash from "object-hash";
import { IQueryDescriptor } from "../api/query-descriptor";

/** @internal */
export function computeQueryKey(
    descriptor: IQueryDescriptor,
): string {
    return objectHash(descriptor);
}
