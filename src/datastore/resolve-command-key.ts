import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { DatastoreContext } from "./datastore-context";

/** @internal */
export async function resolveCommandKey(
    context: DatastoreContext,
    keyOrId: number | string,
): Promise<number> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db } = context;

    if (NonEmptyString.is(keyOrId)) {
        const matches = await db.commands.where("id").equals(keyOrId).primaryKeys();

        if (matches.length <= 0) {
            return 0;
        }

        const key = matches[0];

        // istanbul ignore else: debug assertion
        if (DEBUG) {
            assert(matches.length === 1);
            assert(PositiveInteger.is(key));
        }

        return key;
    }

    if (PositiveInteger.is(keyOrId)) {
        return keyOrId;
    }

    return 0;
}
