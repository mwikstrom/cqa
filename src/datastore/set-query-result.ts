import { JsonValue } from "../api/json-value";
import { IQueryDescriptor } from "../api/query-descriptor";
import { InstanceOf } from "../common-types/instance-of";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonValueType } from "../json/json-value-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { computeQueryKey } from "./compute-query-key";
import { DatastoreContext } from "./datastore-context";
import { QueryDescriptorType } from "./query-descriptor-type";
import { IQueryRecord } from "./query-record";
import { QueryRecordType } from "./query-record-type";

export async function setQueryResult(
    context: DatastoreContext,
    query: IQueryDescriptor,
    commit: string,
    data: JsonValue,
): Promise<string | undefined> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(QueryDescriptorType.is(query));
        assert(NonEmptyString.is(commit));
        assert(JsonValueType.is(data));
    }

    const { db, crypto } = context;
    const key = computeQueryKey(query);
    const { type, param } = query;
    const timestamp = new Date();
    const paramcipher = param === undefined ? new ArrayBuffer(0) : await crypto.encrypt(param, key);
    const resultcipher = await crypto.encrypt(data, key);
    const record: IQueryRecord = {
        commit,
        paramcipher,
        timestamp,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryRecordType.is(record));
        assert(InstanceOf(ArrayBuffer).is(resultcipher));
    }

    return await db.transaction(
        "rw",
        db.queries,
        db.results,
        async () => {
            const replaced = await db.queries.get(key);

            // istanbul ignore else: debug assertion
            if (DEBUG) {
                assert(replaced === undefined || QueryRecordType.is(replaced));
            }

            await Promise.all([
                db.queries.put(record, key),
                db.results.put(resultcipher, key),
            ]);

            return replaced ? replaced.commit : undefined;
        },
    );
}
