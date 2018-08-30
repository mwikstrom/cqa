/** @internal */
export interface IQueryRecord {
    commit: string;
    key: ArrayBuffer;
    paramcipher: ArrayBuffer;
    timestamp: Date;
    type: string;
}
