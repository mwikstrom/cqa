import { IJsonCrypto } from "../api/json-crypto";
import { IQueryData } from "../api/query-data";
import { IQueryDescriptor } from "../api/query-descriptor";
import { IQueryListOptions } from "../api/query-list-options";
import { JsonCryptoType } from "../json/json-crypto-type";
import { JsonValueType } from "../json/json-value-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";
import { QueryDataType } from "./query-data-type";
import { QueryListOptionsType } from "./query-list-options-type";
import { IQueryRecord } from "./query-record";
import { QueryRecordType } from "./query-record-type";

/** @internal */
export async function getQueryList(
    context: DatastoreContext,
    options: IQueryListOptions = {},
): Promise<IQueryData[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(QueryListOptionsType.is(options));
    }

    const { db, crypto } = context;
    const recordArray = await db.queries.toArray();

    return await Promise.all(
        recordArray.map(
            record => createQueryDataFromRecord(record, crypto),
        ),
    );
}

async function createQueryDataFromRecord(
    record: IQueryRecord,
    crypto: IJsonCrypto,
): Promise<IQueryData> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryRecordType.is(record));
        assert(JsonCryptoType.is(crypto));
    }

    const {
        commit,
        key,
        paramcipher,
        timestamp,
        type,
    } = record;

    const param = paramcipher.byteLength === 0 ? undefined : await crypto.decrypt(paramcipher, key);

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(param === undefined || JsonValueType.is(param));
    }

    const descriptor: IQueryDescriptor = {
        param,
        type,
    };

    const data: IQueryData = {
        commit,
        descriptor,
        timestamp,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryDataType.is(data));
    }

    return data;
}
