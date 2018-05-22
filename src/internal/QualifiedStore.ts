import {
    UpgradeDB,
} from "idb";

import {
    DEBUG,
    demand,
    LIB_NAME_SHORT,
    StoreBase,
} from "../internal";

const CURRENT_DB_VERSION = 1;

export class QualifiedStore extends StoreBase {
    constructor(
        name: string,
    ) {
        super(name, CURRENT_DB_VERSION);
    }

    // TODO: Add qualified store functions

    protected upgrade(db: UpgradeDB) {
        // istanbul ignore else
        if (DEBUG) {
            demand(db.version === CURRENT_DB_VERSION);
        }

        demand(
            db.oldVersion >= 0 && db.oldVersion <= CURRENT_DB_VERSION,
            `[${LIB_NAME_SHORT}] Cannot upgrade data store "${this.name}" from version ${db.oldVersion}`,
        );

        if (db.oldVersion === 0) {
            setupCommandStore(db);
            setupQueryStore(db);
        }
    }
}

const setupCommandStore = (_: UpgradeDB): void => {
    // TODO: setup command store
    // const store = db.createObjectStore(COMMAND_STORE_NAME, { autoIncrement: true });
    // TODO: Add command store indexes!
};

const setupQueryStore = (_: UpgradeDB): void => {
    // TODO: setup query store
};
