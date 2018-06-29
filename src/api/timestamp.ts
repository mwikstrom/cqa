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

export type TimestampComparable = Timestamp | Date;

export interface ITimestampStatic {
    compare(first: TimestampComparable, second: TimestampComparable): -1 | 0 | 1;
    max(generator: string): Timestamp;
    min(generator: string): Timestamp;
    test(value: any): value is Timestamp;
    toDate(value: Timestamp): Date;
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
