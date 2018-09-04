import { ICommandData } from "../api/command-data";
import { IJsonCrypto } from "../api/json-crypto";
import { JsonCryptoType } from "../json/json-crypto-type";
import { assert } from "../utils/assert";
import { DEBUG } from "../utils/env";
import { CommandDataType } from "./command-data-type";
import { ICommandRecord } from "./command-record";
import { CommandRecordType } from "./command-record-type";
import { IProtectedCommandData } from "./protected-command-data";
import { ProtectedCommandDataType } from "./protected-command-data-type";

/** @internal */
export async function createCommandDataFromRecord(
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
        datacipher,
        key,
        resolved,
        salt,
        timestamp,
    } = record;

    const decrypted = await crypto.decrypt(datacipher, salt);

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
        timestamp,
        type,
    };

    // istanbul ignore else: debug assertion
    if (DEBUG) {
        assert(CommandDataType.is(data));
    }

    return data;
}
