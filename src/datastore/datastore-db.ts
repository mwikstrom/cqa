import Dexie from "dexie";
import { ICommandRecord } from "./command-record";

/** @internal */
export class DatastoreDB extends Dexie {
    public static readonly VERSION = 1;

    public commands!: Dexie.Table<ICommandRecord, number>;
    public meta!: Dexie.Table<any, string>;

    constructor(name: string, encryptedName: ArrayBuffer) {
        super(name);

        this.version(1).stores({
            commands: "++key",
            meta: "",
        });

        this.on("populate", () => this.meta.add(encryptedName, "encrypted_name"));
    }
}
