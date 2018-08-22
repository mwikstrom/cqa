import Dexie from "dexie";
import { ICommandTableValue } from "./command-table-value";

/** @internal */
export class DatastoreDB extends Dexie {
    public commands!: Dexie.Table<ICommandTableValue, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            commands: "++, &id, status",
        });
    }
}
