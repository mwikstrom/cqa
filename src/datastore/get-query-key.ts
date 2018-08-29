import objectHash from "object-hash";
import { IQueryDescriptor } from "../api/query-descriptor";

export function getQueryKey(
    descriptor: IQueryDescriptor,
): string {
    return objectHash(descriptor);
}
