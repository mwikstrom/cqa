import Dexie from "dexie";
import { ICommandRecord } from "./command-record";
import { IQueryRecord } from "./query-record";

/** @internal */
export class DatastoreDB extends Dexie {
    public static readonly VERSION = 1;

    public readonly commands!: Dexie.Table<ICommandRecord, number>;
    public readonly meta!: Dexie.Table<any, string>;
    public readonly queries!: Dexie.Table<IQueryRecord, string>;
    public readonly results!: Dexie.Table<ArrayBuffer, string>;

    constructor(name: string, encryptedName: ArrayBuffer) {
        super(name);

        this.version(1).stores({
            commands: "++key, commit",
            meta: "",
            queries: "key, commit, timestamp, type",
            results: "",
        });

        this.on("populate", () => this.meta.add(encryptedName, "encrypted_name"));
    }
}
