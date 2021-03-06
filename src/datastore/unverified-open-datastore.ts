import Dexie from "dexie";
import { IDatastore } from "../api/datastore";
import { IDatastoreOptions } from "../api/datastore-options";
import { IJsonCrypto } from "../api/json-crypto";
import { NonEmptyString } from "../common-types/non-empty-string";
import { PositiveInteger } from "../common-types/positive-integer";
import { JsonValueType } from "../json/json-value-type";
import { bindFirst } from "../utils/bind-first";
import { LIB_NAME_SHORT } from "../utils/env";
import { unwrapVerifications, verify, withVerification } from "../utils/verify";
import { addCommand as rawAddCommand } from "./add-command";
import { CommandInputType } from "./command-input-type";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { getCommandList as rawGetCommandList } from "./get-command-list";
import { getQueryList as rawGetQueryList } from "./get-query-list";
import { getQueryResult as rawGetQueryResult } from "./get-query-result";
import { purge as rawPurge } from "./purge";
import { QueryDescriptorType } from "./query-descriptor-type";
import { QueryListOptionsType } from "./query-list-options-type";
import { setCommandResolved as rawSetCommandResolved } from "./set-command-resolved";
import { setQueryResult as rawSetQueryResult } from "./set-query-result";
import { setupCommandListener } from "./setup-command-listener";
import { updateQueryResult as rawUpdateQueryResult } from "./update-query-result";

/** @internal */
export async function unverifiedOpenDatastore(
    options: IDatastoreOptions,
): Promise<IDatastore> {
    const {
        name,
        crypto,
        now = () => new Date(),
        on,
    } = options;

    await checkDatabase(name, crypto);

    const qualifiedName = makeQualifiedName(name);
    const encryptedName = await crypto.encrypt(name);
    const db = new DatastoreDB(qualifiedName, encryptedName);

    const isMaster = () => !!db._localSyncNode && db._localSyncNode.isMaster === 1;
    let notifiedIsMaster = false;
    const whenMaster = new Promise<void>(resolve => db.on("cleanup", () => {
        if (!notifiedIsMaster && isMaster()) {
            notifiedIsMaster = true;

            resolve();

            if (on && typeof on.master === "function") {
                on.master();
            }
        }
    }));

    if (on && on.command) {
        setupCommandListener(db, crypto, on.command);
    }

    await db.open();

    const unwrappedCrypto = unwrapVerifications(crypto);
    const context = new DatastoreContext(db, unwrappedCrypto, now);

    const addCommand = withVerification(
        bindFirst(rawAddCommand, context),
        input => verify("command input", input, CommandInputType),
    );

    const close = () => {
        db.close();

        if (on && typeof on.close === "function") {
            on.close();
        }
    };

    const getCommandList = bindFirst(rawGetCommandList, context);

    const getQueryResult = withVerification(
        bindFirst(rawGetQueryResult, context),
        query => verify("query descriptor", query, QueryDescriptorType),
    );

    // TODO: Add verification for purge options
    const purge = bindFirst(rawPurge, context);

    const setCommandResolved = bindFirst(rawSetCommandResolved, context);
    const unverifiedSetCommandRejected: IDatastore["setCommandRejected"] = key => setCommandResolved(key, "");
    const unverifiedSetCommandAccepted: IDatastore["setCommandAccepted"] = setCommandResolved;

    const setCommandAccepted = withVerification(
        unverifiedSetCommandAccepted,
        (key, commit) => {
            verify("command key", key, PositiveInteger);
            verify("commit version", commit, NonEmptyString);
        },
    );

    const setCommandRejected = withVerification(
        unverifiedSetCommandRejected,
        key => verify("command key", key, PositiveInteger),
    );

    const getQueryList = withVerification(
        bindFirst(rawGetQueryList, context),
        opts => opts !== undefined && verify("query list options", opts, QueryListOptionsType),
    );

    const setQueryResult = withVerification(
        bindFirst(rawSetQueryResult, context),
        (query, commit, data) => {
            verify("query descriptor", query, QueryDescriptorType);
            verify("commit version", commit, NonEmptyString);
            verify("query result data", data, JsonValueType);
        },
    );

    // TODO: Validation
    const updateQueryResult = bindFirst(rawUpdateQueryResult, context);

    const api: IDatastore = {
        get isMaster() { return isMaster(); },
        get isOpen() { return db.isOpen(); },
        get whenMaster() { return whenMaster; },
        addCommand,
        close,
        getCommandList,
        getQueryList,
        getQueryResult,
        purge,
        setCommandAccepted,
        setCommandRejected,
        setQueryResult,
        updateQueryResult,
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
