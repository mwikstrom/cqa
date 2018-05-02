import { ReadonlyJsonValue } from "./Json";
import { Query } from "./Query";

export class UnknownQuery extends Query {
    constructor(
        descriptor: ReadonlyJsonValue,
        key: string,
    ) {
        super();
        dataMap.set(this, { descriptor, key });
    }

    public buildDescriptor() {
        return dataMap.get(this)!.descriptor;
    }

    public buildKey() {
        return dataMap.get(this)!.key;
    }

    public buildSnapshot() {
        const snapshot = dataMap.get(this)!.snapshot;
        return snapshot !== undefined ? snapshot : null;
    }

    public onSnapshot(
        data: ReadonlyJsonValue,
    ) {
        dataMap.get(this)!.snapshot = data;
    }
}

interface IUnknownQueryData {
    readonly descriptor: ReadonlyJsonValue;
    readonly key: string;
    snapshot?: ReadonlyJsonValue;
}

const dataMap = new WeakMap<UnknownQuery, IUnknownQueryData>();
