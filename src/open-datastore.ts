import { addCommand } from "./add-command";
import { bindFirst } from "./bind-first";
import { bindThis } from "./bind-this";
import { IDatastore } from "./datastore";
import { DatastoreContext } from "./datastore-context";
import { DatastoreDB } from "./datastore-db";
import { getActiveCommands } from "./get-active-commands";
import { getCommandById } from "./get-command-by-id";
import { getCommandByKey } from "./get-command-by-key";
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
        getCommandById: bindFirst(getCommandById, context),
        getCommandByKey: bindFirst(getCommandByKey, context),
        getPendingCommands: bindFirst(getPendingCommands, context),
    };

    return api;
}
