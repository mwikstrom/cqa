import Dexie from "dexie";
import { CleanTypeOf } from "../common-runtime-types";
import { CommandTableValueType } from "./runtime-types";

export class DB extends Dexie {
    public commands!: Dexie.Table<ICommandTableValue, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            commands: "++key, &id",
        });
    }
}

export type ICommandTableValue = CleanTypeOf<typeof CommandTableValueType>;
