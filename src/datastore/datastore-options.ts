import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";
import { IJsonCrypto, JsonCryptoType } from "../json/json-crypto";

/** @public */
export interface IDatastoreOptions {
    name: string;
    crypto?: IJsonCrypto;
}

/** @internal */
export const DatastoreOptionsType = t.intersection([
    t.interface({
        name: NonEmptyString,
    }),
    t.partial({
        crypto: JsonCryptoType,
    }),
]);
