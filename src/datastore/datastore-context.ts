import { IJsonCrypto } from "../api/json-crypto";
import { JsonCryptoType } from "../json/json-crypto-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreDB } from "./datastore-db";

/** @internal */
export class DatastoreContext {
    constructor(
        readonly db: DatastoreDB,
        readonly crypto: IJsonCrypto,
    ) {
        // istanbul ignore else: debug assertion
        if (DEBUG) {
            assert(db instanceof DatastoreDB);
            assert(JsonCryptoType.is(crypto));
        }
    }
}
