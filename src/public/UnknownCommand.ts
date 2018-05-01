import { Command } from "./Command";
import { ReadonlyJsonValue } from "./Json";

export class UnknownCommand extends Command {
    constructor(data: ReadonlyJsonValue) {
        super();
        unknownCommandDataMap.set(this, data);
    }

    public get commandData(): ReadonlyJsonValue {
        return unknownCommandDataMap.get(this)!;
    }
}

const unknownCommandDataMap = new WeakMap<UnknownCommand, ReadonlyJsonValue>();
