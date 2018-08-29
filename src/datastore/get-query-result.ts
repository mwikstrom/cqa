import { IQueryDescriptor } from "../api/query-descriptor";
import { IQueryResult } from "../api/query-result";
import { InstanceOf } from "../common-types/instance-of";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { computeQueryKey } from "./compute-query-key";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { QueryDescriptorType } from "./query-descriptor-type";
import { IQueryRecord } from "./query-record";
import { QueryRecordType } from "./query-record-type";
import { QueryResultType } from "./query-result-type";

export async function getQueryResult(
    context: DatastoreContext,
    query: IQueryDescriptor,
): Promise<IQueryResult | undefined> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(QueryDescriptorType.is(query));
    }

    const { db, crypto } = context;
    const key = computeQueryKey(query);

    const tx = await db.transaction(
        "r",
        db.queries,
        db.results,
        () => runTransaction(db, key),
    );

    if (!tx) {
        return undefined;
    }

    const { cipher, record } = tx;

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(InstanceOf(ArrayBuffer).is(cipher));
        assert(QueryRecordType.is(record));
    }

    const {
        commit,
        timestamp,
    } = record;

    const data = await crypto.decrypt(cipher, key);
    const result: IQueryResult = {
        commit,
        data,
        timestamp,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryResultType.is(result));
    }

    return result;
}

interface ITransactionResult {
    cipher: ArrayBuffer;
    record: IQueryRecord;
}

async function runTransaction(
    db: DatastoreDB,
    key: string,
): Promise<ITransactionResult | undefined> {
    const [
        record,
        cipher,
    ] = await Promise.all([
        db.queries.get(key),
        db.results.get(key),
    ]);

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        if (record === undefined) {
            assert(cipher === undefined);
        } else {
            assert(QueryRecordType.is(record));
            assert(InstanceOf(ArrayBuffer).is(cipher));
        }
    }

    if (record !== undefined && cipher !== undefined) {
        return { cipher, record };
    } else {
        return undefined;
    }
}
