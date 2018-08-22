import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonCryptoOptionsType } from "../json/json-crypto-options";
import { bindFirst } from "../utils/bind-first";
import { bindThis } from "../utils/bind-this";
import { LIB_NAME_SHORT } from "../utils/env";
import { unwrapVerifications, verify, withVerification } from "../utils/verify";
import { ActiveCommandOptionsType } from "./active-command-options";
import { addCommand as rawAddCommand } from "./add-command";
import { CommandInputType } from "./command-input";
import { IDatastore } from "./datastore";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { IDatastoreOptions } from "./datastore-options";
import { getActiveCommands as rawGetActiveCommands } from "./get-active-commands";
import { getCommand as rawGetCommand } from "./get-command";
import { getPendingCommands as rawGetPendingCommands } from "./get-pending-commands";
import { PendingCommandOptionsType } from "./pending-command-options";
import { setCommandAccepted as rawSetCommandAccepted } from "./set-command-accepted";
import { setCommandRejected as rawSetCommandRejected } from "./set-command-rejected";

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

    const getActiveCommands = withVerification(
        bindFirst(rawGetActiveCommands, context),
        opts => opts && verify("active command options", opts, ActiveCommandOptionsType),
    );

    const getCommand = bindFirst(rawGetCommand, context);

    const getPendingCommands = withVerification(
        bindFirst(rawGetPendingCommands, context),
        opts => opts && verify("pending command options", opts, PendingCommandOptionsType),
    );

    const setCommandAccepted = withVerification(
        bindFirst(rawSetCommandAccepted, context),
        (_, commit) => verify("commit version", commit, NonEmptyString),
    );

    const setCommandRejected = bindFirst(rawSetCommandRejected, context);

    const api: IDatastore = {
        addCommand,
        close,
        getActiveCommands,
        getCommand,
        getPendingCommands,
        setCommandAccepted,
        setCommandRejected,
    };

    return api;
}
