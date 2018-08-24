import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { JsonCryptoType } from "../json/json-crypto";
import { IDatastoreOptions } from "./datastore-options";

/** @internal */
export const DatastoreOptionsType: t.Type<IDatastoreOptions> = t.interface({
    crypto: JsonCryptoType,
    name: NonEmptyString,
});
