import { assert } from "../utils/assert";
import { createIdentifier } from "../utils/create-identifier";
import { DEBUG } from "../utils/env";
import { ICommandData } from "./command-data";
import { CommandDataType } from "./command-data-type";
import { ICommandInput } from "./command-input";
import { CommandInputType } from "./command-input-type";
import { ICommandRecord } from "./command-record";
import { CommandRecordType } from "./command-record-type";
import { DatastoreContext } from "./datastore-context";
import { ProtectedCommandDataType } from "./protected-command-data-type";

/** @internal */
export async function addCommand(
    context: DatastoreContext,
    input: ICommandInput,
): Promise<ICommandData> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(context instanceof DatastoreContext);
        assert(CommandInputType.is(input));
    }

    const {
        db,
        crypto,
    } = context;

    const {
        id = createIdentifier(),
        payload = null,
        target,
        type,
    } = input;

    const plain = {
        id,
        payload,
        target,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(ProtectedCommandDataType.is(plain));
    }

    const salt = createIdentifier();
    const cipherdata = await crypto.encrypt(plain, salt);
    const resolved = false;
    const commit = "";
    let key = 0;

    const record: ICommandRecord = {
        cipherdata,
        commit,
        key,
        resolved,
        salt,
    };

    delete record.key;
    key = await db.commands.add(record);

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        record.key = key;
        assert(CommandRecordType.is(record));
    }

    const result = "pending";
    const data: ICommandData = {
        commit,
        id,
        key,
        payload,
        result,
        target,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(CommandDataType.is(data));
    }

    return data;
}
