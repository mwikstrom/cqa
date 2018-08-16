import Dexie from "dexie";

export class DB extends Dexie {
    public commands!: Dexie.Table<ICommandTableValue, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            commands: "++key, &id",
        });
    }
}

export interface ICommandTableValue {
    id: string;
    payload: any;
    target: string;
    timestamp: number;
    type: string;
}
