declare module "fake-indexeddb" {
    const fakeIndexedDB: IDBFactory;
    export default fakeIndexedDB;
}

declare module "fake-indexeddb/lib/FDBKeyRange" {
    const fakeIDBKeyRange: IDBKeyRange;
    export default fakeIDBKeyRange;
}
