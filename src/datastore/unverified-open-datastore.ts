import Dexie from "dexie";
import { IDatastore, IDatastoreOptions, IJsonCrypto } from "..";
import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { bindFirst } from "../utils/bind-first";
import { bindThis } from "../utils/bind-this";
import { LIB_NAME_SHORT } from "../utils/env";
import { unwrapVerifications, verify, withVerification } from "../utils/verify";
import { addCommand as rawAddCommand } from "./add-command";
import { CommandInputType } from "./command-input-type";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { getCommandList as rawGetCommandList } from "./get-command-list";
import { setCommandResolved as rawSetCommandResolved } from "./set-command-resolved";

/** @internal */
export async function unverifiedOpenDatastore(
    options: IDatastoreOptions,
): Promise<IDatastore> {
    const {
        name,
        crypto,
    } = options;

    await checkDatabase(name, crypto);

    const qualifiedName = makeQualifiedName(name);
    const encryptedName = await crypto.encrypt(name);
    const db = new DatastoreDB(qualifiedName, encryptedName);
    await db.open();

    const unwrappedCrypto = unwrapVerifications(crypto);
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

const makeQualifiedName = (name: string) => `${LIB_NAME_SHORT}-datastore-${name}`;

async function checkDatabase(
    name: string,
    crypto: IJsonCrypto,
): Promise<void> {
    const db = new Dexie(makeQualifiedName(name), { addons: [] });

    let dbExists = true;
    let dbOk = false;
    let cryptoOk = false;

    try {
        await db.open();

        const meta = db.table<any, string>("meta");
        const encryptedName = await meta.get("encrypted_name");
        dbOk = db.verno <= DatastoreDB.VERSION && encryptedName instanceof ArrayBuffer;
        const decryptedName = await crypto.decrypt(encryptedName);
        cryptoOk = (name === decryptedName);
    } catch (err) {
        if (err && err.name === "NoSuchDatabaseError") {
            dbExists = false;
        }
    } finally {
        db.close();
    }

    if (dbExists) {
        if (!dbOk) {
            throw new Error(`'${name}' is not a valid ${LIB_NAME_SHORT} datastore`);
        }

        if (!cryptoOk) {
            throw new Error(`Incorrect crypto for ${LIB_NAME_SHORT} datastore '${name}'`);
        }
    }
}
