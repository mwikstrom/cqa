import objectHash from "object-hash";
import { IQueryDescriptor } from "../api/query-descriptor";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { QueryDescriptorType } from "./query-descriptor-type";

/** @internal */
export function computeQueryKey(
    query: IQueryDescriptor,
): string {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryDescriptorType.is(query));
    }

    return objectHash(query);
}
