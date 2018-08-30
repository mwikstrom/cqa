const charmap: {
    [c: string]: string;
} = {
    "+": "-",
    "/": "_",
};

/** @internal */
export function urlEncodeBase64(
    base64: string,
): string {
    return base64.replace(/[+/=]/g, c => charmap[c] || "");
}
