/** @internal */
export function urlEncodeBase64(
    base64: string,
): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
