import { IJsonCrypto } from "../api/json-crypto";
import { IJsonObject } from "../api/json-value";
import { IQueryData } from "../api/query-data";
import { IQueryDescriptor } from "../api/query-descriptor";
import { IQueryListOptions } from "../api/query-list-options";
import { computeJsonHash } from "../json/compute-json-hash";
import { JsonCryptoType } from "../json/json-crypto-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { uint8ArrayToBase64Url } from "../utils/uint8-array-to-base64-url";
import { DatastoreContext } from "./datastore-context";
import { extractQueryTags } from "./extract-query-tags";
import { QueryDataType } from "./query-data-type";
import { QueryDescriptorType } from "./query-descriptor-type";
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
    const filter: IJsonObject = { };

    if (options.type !== undefined) {
        filter.type = options.type;
    }

    if (options.param !== undefined) {
        filter.param = options.param;
    }

    const tagArray = extractQueryTags(filter);
    let recordArray: IQueryRecord[];

    if (tagArray.length === 0) {
        recordArray = await db.queries.toArray();
    } else if (tagArray.length === 1) {
        const hash = await computeJsonHash(tagArray[0]);
        recordArray = await db.queries.where("tags").equals(hash).toArray();
    } else {
        const hashArray = await Promise.all(tagArray.map(computeJsonHash));
        const matchArray = await Promise.all(hashArray.map(async hash => {
            const keyArray = await db.queries.where("tags").equals(hash).primaryKeys();
            return new Map(keyArray.map(key =>
                [uint8ArrayToBase64Url(new Uint8Array(key)), key ] as [string, ArrayBuffer],
            ));
        }));

        matchArray.sort((a, b) => a.size - b.size);

        const baseMap = matchArray.shift()!;
        const matchingKeys: ArrayBuffer[] = [];

        baseMap.forEach((raw, key) => {
            if (matchArray.every(map => map.has(key))) {
                matchingKeys.push(raw);
            }
        });

        recordArray = await Promise.all(matchingKeys.map(async key => (await db.queries.get(key))!));
    }

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
        descriptorcipher,
        timestamp,
    } = record;

    const descriptor = (await crypto.decrypt(descriptorcipher, key)) as any as IQueryDescriptor;

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(QueryDescriptorType.is(descriptor));
    }

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
