/** @internal */
export interface IQueryRecord {
    commit: string;
    key: string;
    paramcipher: ArrayBuffer;
    timestamp: Date;
    type: string;
}
