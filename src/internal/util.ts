export function validateValue<T>(
    value: T,
    test: (value: T) => boolean,
    what: string,
): void {
    if (!test(value)) {
        let str = JSON.stringify(value);

        if (str === undefined) {
            str = String(value);
        }

        throw new TypeError(`Invalid ${what}: ${str}`);
    }
}

export const validateFinite = (value: number) => validateValue(
    value,
    isFinite,
    "finite number",
);

export function comparePrimitive<T>(
    first: T,
    second: T,
): -1 | 0 | 1 {
    if (first > second) {
        return 1;
    } else if (first < second) {
        return -1;
    } else {
        return 0;
    }
}

export function compareNumber(
    first: number,
    second: number,
): -1 | 0 | 1 {
    validateFinite(first);
    validateFinite(second);
    return Math.sign(first - second) as -1 | 0 | 1;
}

// note: this won't work for negative numbers, nor for non-integer numbers.
export function leadingZeroes(value: number, count: number): string {
    const str = String(value);
    return "0".repeat(count - str.length) + str;
}
