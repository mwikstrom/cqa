import {
    compareTimestamps,
    isTimestamp,
    maxTimestamp,
    minTimestamp,
    timestampToDate,
    timestampToString,
} from "../internal/timestamp";

/**
 * A timestamp value is globally unique and indicates a particular instant in time with nanosecond precision.
 *
 * Timestamp values are structured as triples. The first element is a number that represents the number of
 * seconds since midnight UTC on 1st January 1970 in the Gregorian calendar. The second element is a number
 * that represents the number of nanoseconds that have elapsed since the start of the first element. Finally,
 * the third element is a globally unique identifier of the generator that emitted the timestamp value.
 *
 * A timestamp generator can emit values in real time or stable time. In real time, timestamps may be emitted
 * in any order. But in stable time, a generator MUST emit strictly increasing timestamps.
 */
export type Timestamp = [
    number,
    number,
    string
];

/**
 * A value that can be compared to a timestamp.
 */
export type TimestampComparable = Timestamp | Date;

/**
 * The timestamp API
 */
export interface ITimestampStatic {
    /**
     * Compares two timestamp values and determines their relative casuality.
     *
     * @returns `-1` when the first argument happened before the second argument
     *          `0`  when both arguments are equal
     *          `1`  when the first argument happened after the second argument
     */
    compare(first: TimestampComparable, second: TimestampComparable): -1 | 0 | 1;

    /**
     * Gets the maximum timestamp value for the specified generator identifier.
     */
    max(generator: string): Timestamp;

    /**
     * Gets the minimum timestamp value for the specified generator identifier.
     */
    min(generator: string): Timestamp;

    /**
     * Determines whether the specified value is a timestamp.
     */
    test(value: any): value is Timestamp;

    /**
     * Converts the specified timestamp to a date object.
     *
     * Note: Converting to a date will loose sub-millisecond precision.
     */
    toDate(value: Timestamp): Date;

    /**
     * Converts the specified timestamp to a string.
     *
     * Note: The strings returned by this function have the same lexicographical sort order as provided by the
     *       timestamp compare function.
     */
    toString(value: Timestamp): string;
}

export const timestamp = Object.freeze<ITimestampStatic>({
    compare: compareTimestamps,
    max: maxTimestamp,
    min: minTimestamp,
    test: isTimestamp,
    toDate: timestampToDate,
    toString: timestampToString,
});
