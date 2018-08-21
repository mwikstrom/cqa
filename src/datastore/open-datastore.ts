import { bindFirst } from "../utils/bind-first";
import { bindThis } from "../utils/bind-this";
import { addCommand } from "./add-command";
import { IDatastore } from "./datastore";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { getActiveCommands } from "./get-active-commands";
import { getCommand } from "./get-command";
import { getPendingCommands } from "./get-pending-commands";

// TODO: Add option to specify crypto
/** @public */
export async function openDatastore(
    name: string,
): Promise<IDatastore> {
    const db = new DatastoreDB(name);
    await db.open();

    const context = new DatastoreContext(db);

    const api: IDatastore = {
        addCommand: bindFirst(addCommand, context),
        close: bindThis(db, db.close),
        getActiveCommands: bindFirst(getActiveCommands, context),
        getCommand: bindFirst(getCommand, context),
        getPendingCommands: bindFirst(getPendingCommands, context),
    };

    return api;
}
