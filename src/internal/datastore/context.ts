import { assert } from "../assert";
import { DEBUG } from "../env";
import { DB } from "./db";

export class Context {
    constructor(
        readonly db: DB,
    ) {
        // istanbul ignore else: debug assertion
        if (DEBUG) {
            assert(db instanceof DB);
        }
    }
}
