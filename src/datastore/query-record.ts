/** @internal */
export interface IQueryRecord {
    commit: string;
    descriptorcipher: ArrayBuffer;
    key: ArrayBuffer;
    tags: ArrayBuffer[];
    timestamp: Date;
}
