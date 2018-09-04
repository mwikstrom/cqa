import { ICommandData } from "../api/command-data";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { createCommandDataFromRecord } from "./create-command-data-from-record";
import { DatastoreContext } from "./datastore-context";

/** @internal */
export async function getCommandList(
    context: DatastoreContext,
): Promise<ICommandData[]> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
    }

    const { db, crypto } = context;
    const recordArray = await db.commands.toArray();

    return await Promise.all(
        recordArray.map(
            record => createCommandDataFromRecord(record, crypto),
        ),
    );
}
