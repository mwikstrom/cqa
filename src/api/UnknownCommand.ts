import {
    Command,
    ReadonlyJsonValue,
} from "../api";

export class UnknownCommand extends Command {
    constructor(descriptor: ReadonlyJsonValue) {
        super();
        descriptorMap.set(this, descriptor);
    }

    public buildDescriptor(): ReadonlyJsonValue {
        return descriptorMap.get(this)!;
    }
}

const descriptorMap = new WeakMap<UnknownCommand, ReadonlyJsonValue>();
