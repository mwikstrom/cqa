import { assert } from "./assert";
import { DatastoreDB } from "./datastore-db";
import { DEBUG } from "./env";

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
