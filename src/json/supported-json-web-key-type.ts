import * as t from "io-ts";
import { NonEmptyString } from "../common-types/non-empty-string";

const RequiredKeyOpsType = t.refinement(
    t.array(t.string),
    value => value.length >= 2 && value.indexOf("encrypt") >= 0 && value.indexOf("decrypt") >= 0,
    "[\"encrypt\", \"decrypt\"]",
);

/** @internal */
export const SupportedJsonWebKeyType = t.interface({
    alg: t.literal("A256GCM"),
    ext: t.literal(true),
    k: NonEmptyString,
    key_ops: RequiredKeyOpsType,
    kty: t.literal("oct"),
});
