import { bindFirst, bindThis } from "../../internal/bind";
import { addCommand } from "../../internal/datastore/add-command";
import { Context } from "../../internal/datastore/context";
import { DB } from "../../internal/datastore/db";
import { getCommandById, getCommandByKey, getPendingCommands } from "../../internal/datastore/get-command";
import { IDatastore } from "./typings";

// TODO: Add option to specify crypto
export async function openDatastore(
    name: string,
): Promise<IDatastore> {
    const db = new DB(name);
    await db.open();

    const context = new Context(db);

    const api: IDatastore = {
        addCommand: bindFirst(addCommand, context),
        close: bindThis(db, db.close),
        getCommandById: bindFirst(getCommandById, context),
        getCommandByKey: bindFirst(getCommandByKey, context),
        getPendingCommands: bindFirst(getPendingCommands, context),
    };

    return api;
}
