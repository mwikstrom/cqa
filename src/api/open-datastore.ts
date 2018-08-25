import { IDatastore, IDatastoreOptions } from "..";
import { DatastoreOptionsType } from "../datastore/datastore-options-type";
import { unverifiedOpenDatastore } from "../datastore/unverified-open-datastore";
import { verify, withVerification } from "../utils/verify";

let wrapped: typeof unverifiedOpenDatastore;

/** @public */
export async function openDatastore(
    options: IDatastoreOptions,
): Promise<IDatastore> {
    if (!wrapped) {
        wrapped = withVerification(
            unverifiedOpenDatastore,
            opts => verify("datastore options", opts, DatastoreOptionsType),
        );
    }

    return wrapped(options);
}
