import {
    DB,
    default as idb,
    UpgradeDB,
} from "idb";

import {
    DEBUG,
    demand,
    LIB_NAME_SHORT,
    reject,
} from "../internal";

export abstract class StoreBase {
    private _dbPromise?: Promise<DB>;

    private _isClosed = false;

    private readonly _name: string;

    private readonly _version: number;

    constructor(
        name: string,
        version: number,
    ) {
        this._name = name;
        this._version = version;
    }

    protected get db(): Promise<DB> {
        // istanbul ignore else
        if (DEBUG) {
            demand(
                !this._isClosed,
                `[${LIB_NAME_SHORT}] Data store "${this._name}" has been closed`,
            );
        }

        if (this._dbPromise === undefined) {
            this._dbPromise = idb.open(
                this._name,
                this._version,
                db => this.upgrade(db),
            );
        }

        return this._dbPromise;
    }

    protected get name(): string {
        return this._name;
    }

    public close(): void {
        if (!this._isClosed) {
            this._isClosed = true;

            if (this._dbPromise === undefined) {
                this._dbPromise = reject<DB>();
            } else {
                this._dbPromise.then(db => db.close());
            }
        }
    }

    protected abstract upgrade(db: UpgradeDB): void;
}
