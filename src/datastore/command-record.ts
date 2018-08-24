/** @internal */
export interface ICommandRecord {
    cipherdata: ArrayBuffer;
    commit: string;
    key: number;
    resolved: boolean;
    salt: string;
}
