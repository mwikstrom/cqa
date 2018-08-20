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

    // TODO: Declare and use expose helper function
    const api: IDatastore = {
        addCommand: addCommand.bind(undefined, context),
        close: db.close.bind(db),
        getCommandById: getCommandById.bind(undefined, context),
        getCommandByKey: getCommandByKey.bind(undefined, context),
        getPendingCommands: getPendingCommands.bind(undefined, context),
    };

    return api;
}
