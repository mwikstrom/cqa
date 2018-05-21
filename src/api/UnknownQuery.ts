import {
    Query,
    ReadonlyJsonValue,
} from "../api";

/**
 * Represents an unknown query.
 */
export class UnknownQuery extends Query {
    /**
     * Initializes a new unknown query instance.
     *
     * @param descriptor The query descriptor
     * @param key Unique query key (Optional)
     */
    constructor(
        descriptor: ReadonlyJsonValue,
        key?: string,
    ) {
        super();
        dataMap.set(this, { descriptor, key });
    }

    /** @inheritDoc */
    public buildDescriptor() {
        return dataMap.get(this)!.descriptor;
    }

    /** @inheritDoc */
    public buildKey() {
        const storedKey = dataMap.get(this)!.key;
        return storedKey === undefined ? super.buildKey() : storedKey;
    }

    /** @inheritDoc */
    public tryBuildSnapshot(): ReadonlyJsonValue | undefined {
        return dataMap.get(this)!.snapshot;
    }

    /** @inheritDoc */
    public onSnapshot(
        data: ReadonlyJsonValue,
    ) {
        dataMap.get(this)!.snapshot = data;
    }

    /** @inheritDoc */
    public onReset() {
        dataMap.delete(this);
    }
}

interface IUnknownQueryData {
    readonly descriptor: ReadonlyJsonValue;
    readonly key?: string;
    snapshot?: ReadonlyJsonValue;
}

const dataMap = new WeakMap<UnknownQuery, IUnknownQueryData>();
