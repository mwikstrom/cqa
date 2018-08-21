import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreDB } from "./datastore-db";

// TODO: Add crypto/cipher
/** @internal */
export class DatastoreContext {
    constructor(
        readonly db: DatastoreDB,
    ) {
        // istanbul ignore else: debug assertion
        if (DEBUG) {
            assert(db instanceof DatastoreDB);
        }
    }
}