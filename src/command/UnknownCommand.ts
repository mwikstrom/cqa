import { ReadonlyJsonValue } from "../utils/json";
import { Command } from "./Command";

export class UnknownCommand extends Command {
    constructor(data: ReadonlyJsonValue) {
        super();
        unknownCommandDataMap.set(this, data);
    }

    public get commandData() {
        return unknownCommandDataMap.get(this);
    }
}

const unknownCommandDataMap = new WeakMap<UnknownCommand, ReadonlyJsonValue>();
