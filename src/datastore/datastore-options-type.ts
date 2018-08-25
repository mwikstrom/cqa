import * as t from "io-ts";
import { IDatastoreOptions } from "../api/datastore-options";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonCryptoType } from "../json/json-crypto-type";

/** @internal */
export const DatastoreOptionsType: t.Type<IDatastoreOptions> = t.interface({
    crypto: JsonCryptoType,
    name: NonEmptyString,
});
