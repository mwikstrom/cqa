import uuid from "uuid/v4";
import { urlEncodeBase64 } from "./url-encode-base64";

/** @internal */
export function createIdentifier(
    byteLength: number = 16,
): string {
    return urlEncodeBase64(
        btoa(
            String.fromCharCode.apply(
                null,
                uuid(
                    null,
                    new Uint8Array(byteLength),
                ),
            ),
        ),
    );
}
