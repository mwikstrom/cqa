import {
    Timestamp,
    TimestampComparable,
} from "../api/timestamp";

import {
    compareNumber,
    comparePrimitive,
    leadingZeroes,
    validateValue,
} from "./util";

const MIN_SECS = -62167219200;
const MAX_SECS = 253402300799;
const MIN_NANOS = 0;
const MAX_NANOS = 1e9 - 1;
const GENERATOR_PATTERN = /^[0-9a-zA-Z_-]{1,50}$/;

const validateGenerator = (value: string) => validateValue(
    value,
    x => GENERATOR_PATTERN.test(x),
    "timestamp generator identifier",
);

const validateTimestamp = (value: any) => validateValue(
    value,
    isTimestamp,
    "timestamp value",
);

export function compareTimestamps(
    first: TimestampComparable,
    second: TimestampComparable,
): -1 | 0 | 1 {
    if (first instanceof Date) {
        const secondAsDate = second instanceof Date ? second : timestampToDate(second);
        return comparePrimitive(first, secondAsDate);
    } else if (second instanceof Date) {
        const firstAsDate = timestampToDate(first);
        return comparePrimitive(firstAsDate, second);
    }

    validateTimestamp(first);
    validateTimestamp(second);

    // Compare seconds first
    let result = compareNumber(first[0], second[0]);

    // Compare nanoseconds when seconds match
    if (result === 0) {
        result = compareNumber(first[1], second[1]);

        // Finally compare generator identifiers when both seconds and nanoseconds match
        if (result === 0) {
            result = comparePrimitive(first[2], second[2]);
        }
    }

    return result;
}

export function maxTimestamp(generator: string): Timestamp {
    validateGenerator(generator);
    return [ MAX_SECS, MAX_NANOS, generator ];
}

export function minTimestamp(generator: string): Timestamp {
    validateGenerator(generator);
    return [ MIN_SECS, MIN_NANOS, generator ];
}

export function isTimestamp(value: any): value is Timestamp {
    if (!Array.isArray(value) || value.length !== 3) {
        return false;
    }

    const [ secs, nanos, generator ] = value as Timestamp;

    if (!Number.isInteger(secs) || secs < MIN_SECS || secs > MAX_SECS) {
        return false;
    }

    if (!Number.isInteger(nanos) || nanos < MIN_NANOS || nanos > MAX_NANOS) {
        return false;
    }

    if (!GENERATOR_PATTERN.test(generator)) {
        return false;
    }

    return true;
}

export function timestampToDate(value: Timestamp): Date {
    validateTimestamp(value);
    const secs = value[0];
    const nanos = value[1];
    const millis = (secs * 1000) + (nanos / 1e6);
    return new Date(millis);
}

export function timestampToString(value: Timestamp): string {
    const date = new Date(value[0] * 1000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const mins = date.getUTCMinutes();
    const secs = date.getUTCSeconds();
    const nanos = value[1];
    const generator = value[2];
    return leadingZeroes(year, 4)
         + leadingZeroes(month, 2)
         + leadingZeroes(day, 2)
         + leadingZeroes(hour, 2)
         + leadingZeroes(mins, 2)
         + leadingZeroes(secs, 2)
         + leadingZeroes(nanos, 9)
         + "@"
         + generator;
}
