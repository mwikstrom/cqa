import { uint8ArrayToBase64Url } from "./uint8-array-to-base64-url";

/** @internal */
export function createIdentifier(
    byteLength: number = 16,
): string {
    return uint8ArrayToBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}
