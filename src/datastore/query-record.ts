/** @internal */
export interface IQueryRecord {
    commit: string;
    paramcipher: ArrayBuffer;
    timestamp: Date;
    type: string;
}
