import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { JsonCryptoOptionsType } from "../json/json-crypto-options";
import { bindFirst } from "../utils/bind-first";
import { bindThis } from "../utils/bind-this";
import { LIB_NAME_SHORT } from "../utils/env";
import { unwrapVerifications, verify, withVerification } from "../utils/verify";
import { addCommand as rawAddCommand } from "./add-command";
import { CommandInputType } from "./command-input-type";
import { IDatastore } from "./datastore";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { IDatastoreOptions } from "./datastore-options";
import { getCommandList as rawGetCommandList } from "./get-command-list";
import { setCommandResolved as rawSetCommandResolved } from "./set-command-resolved";

/** @public */
export async function openDatastore(
    options: IDatastoreOptions,
): Promise<IDatastore> {
    verify("datastore options", options, JsonCryptoOptionsType);

    const {
        name,
        crypto,
    } = options;

    const db = new DatastoreDB(`${LIB_NAME_SHORT}-datastore-${name}`);
    await db.open();

    const unwrappedCrypto = crypto ? unwrapVerifications(crypto) : crypto;
    const context = new DatastoreContext(db, unwrappedCrypto);

    const addCommand = withVerification(
        bindFirst(rawAddCommand, context),
        input => verify("command input", input, CommandInputType),
    );

    const close = bindThis(db, db.close);
    const getCommandList = bindFirst(rawGetCommandList, context);
    const setCommandResolved = bindFirst(rawSetCommandResolved, context);
    const rawSetCommandRejected: IDatastore["setCommandRejected"] = key => setCommandResolved(key, "");
    const rawSetCommandAccepted: IDatastore["setCommandAccepted"] = setCommandResolved;

    const setCommandAccepted = withVerification(
        rawSetCommandAccepted,
        (key, commit) => {
            verify("command key", key, PositiveInteger);
            verify("commit version", commit, NonEmptyString);
        },
    );

    const setCommandRejected = withVerification(
        rawSetCommandRejected,
        key => verify("command key", key, PositiveInteger),
    );

    const api: IDatastore = {
        addCommand,
        close,
        getCommandList,
        setCommandAccepted,
        setCommandRejected,
    };

    return api;
}
