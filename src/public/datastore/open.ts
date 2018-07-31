import { addCommand } from "../../internal/datastore/add-command";
import { DB } from "../../internal/datastore/db";
import { IDatastore } from "./typings";

export async function openDatastore(
    name: string,
): Promise<IDatastore> {
    const db = new DB(name);
    await db.open();

    // TODO: Declare and use expose helper function
    const api: IDatastore = {
        addCommand: addCommand.bind(undefined, db),
        close: db.close.bind(db),
    };

    return api;
}
