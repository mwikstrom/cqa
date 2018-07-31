import Dexie from "dexie";

export class DB extends Dexie {
    public commands!: Dexie.Table<ICommandTableValue, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            commands: "++",
        });
    }
}

// TODO: Add global id
export interface ICommandTableValue {
    payload: any;
    target: string;
    timestamp: number;
    type: string;
}
