import { IJsonCrypto, JsonCryptoType } from "../json/json-crypto";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { ICommandData } from "./command-data";
import { CommandDataType } from "./command-data-type";
import { ICommandRecord } from "./command-record";
import { CommandRecordType } from "./command-record-type";
import { DatastoreContext } from "./datastore-context";
import { IProtectedCommandData } from "./protected-command-data";
import { ProtectedCommandDataType } from "./protected-command-data-type";

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

async function createCommandDataFromRecord(
    record: ICommandRecord,
    crypto: IJsonCrypto,
): Promise<ICommandData> {
    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(CommandRecordType.is(record));
        assert(record.resolved || !record.commit);
        assert(JsonCryptoType.is(crypto));
    }

    const {
        commit,
        cipherdata,
        key,
        resolved,
        salt,
    } = record;

    const decrypted = await crypto.decrypt(cipherdata, salt);

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(ProtectedCommandDataType.is(decrypted));
    }

    const result = resolved ? commit ? "accepted" : "rejected" : "pending";

    const {
        id,
        payload,
        target,
        type,
    } = decrypted as any as IProtectedCommandData;

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
