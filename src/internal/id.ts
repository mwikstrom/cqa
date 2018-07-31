import uuid from "uuid/v4";

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

function urlEncodeBase64(
    base64: string,
): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
