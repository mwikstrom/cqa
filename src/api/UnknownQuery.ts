import {
    Query,
    ReadonlyJsonValue,
} from "../api";

export class UnknownQuery extends Query {
    constructor(
        descriptor: ReadonlyJsonValue,
        key?: string,
    ) {
        super();
        dataMap.set(this, { descriptor, key });
    }

    public buildDescriptor() {
        return dataMap.get(this)!.descriptor;
    }

    public buildKey() {
        const storedKey = dataMap.get(this)!.key;
        return storedKey === undefined ? super.buildKey() : storedKey;
    }

    public tryBuildSnapshot(): ReadonlyJsonValue | undefined {
        return dataMap.get(this)!.snapshot;
    }

    public onSnapshot(
        data: ReadonlyJsonValue,
    ) {
        dataMap.get(this)!.snapshot = data;
    }

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
