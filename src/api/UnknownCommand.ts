import {
    Command,
    ReadonlyJsonValue,
} from "../api";

/**
 * Represents an unknown command
 */
export class UnknownCommand extends Command {
    /**
     * Initializes a new unknown command instance with the specified descriptor.
     *
     * @param descriptor The command descriptor
     */
    constructor(descriptor: ReadonlyJsonValue) {
        super();
        descriptorMap.set(this, descriptor);
    }

    /** @inheritDoc */
    public buildDescriptor(): ReadonlyJsonValue {
        return descriptorMap.get(this)!;
    }
}

const descriptorMap = new WeakMap<UnknownCommand, ReadonlyJsonValue>();
