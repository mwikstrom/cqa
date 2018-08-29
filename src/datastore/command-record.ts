/** @internal */
export interface ICommandRecord {
    commit: string;
    datacipher: ArrayBuffer;
    key: number;
    resolved: boolean;
    salt: string;
}
