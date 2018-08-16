import { LIB_NAME_SHORT } from "./env";

export function assert(
    condition: boolean,
): void {
    if (!condition) {
        throw new Error(`[${LIB_NAME_SHORT}] assertion failed`);
    }
}
