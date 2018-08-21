import { Dexie } from "dexie";
import fakeIndexedDB from "fake-indexeddb";
import fakeIDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";

Dexie.dependencies.indexedDB = fakeIndexedDB;
Dexie.dependencies.IDBKeyRange = fakeIDBKeyRange;
