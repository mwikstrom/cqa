import Dexie from "dexie";
import { ICommandRecord } from "./command-record";

/** @internal */
export class DatastoreDB extends Dexie {
    public commands!: Dexie.Table<ICommandRecord, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            commands: "++key",
        });
    }
}
