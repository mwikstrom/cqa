import { JsonCryptoOptionsType } from "../json/json-crypto-options";
import { bindFirst } from "../utils/bind-first";
import { bindThis } from "../utils/bind-this";
import { LIB_NAME_SHORT } from "../utils/env";
import { verify } from "../utils/verify";
import { addCommand } from "./add-command";
import { IDatastore } from "./datastore";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { IDatastoreOptions } from "./datastore-options";
import { getActiveCommands } from "./get-active-commands";
import { getCommand } from "./get-command";
import { getPendingCommands } from "./get-pending-commands";
import { setCommandAccepted } from "./set-command-accepted";
import { setCommandRejected } from "./set-command-rejected";

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

    const context = new DatastoreContext(db, crypto);

    const api: IDatastore = {
        addCommand: bindFirst(addCommand, context),
        close: bindThis(db, db.close),
        getActiveCommands: bindFirst(getActiveCommands, context),
        getCommand: bindFirst(getCommand, context),
        getPendingCommands: bindFirst(getPendingCommands, context),
        setCommandAccepted: bindFirst(setCommandAccepted, context),
        setCommandRejected: bindFirst(setCommandRejected, context),
    };

    return api;
}
