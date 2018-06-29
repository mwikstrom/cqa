import {
    Timestamp,
} from "../api/timestamp";

import {
    compareTimestamps,
    maxTimestamp,
    minTimestamp,
    timestampToDate,
    timestampToString,
} from "./timestamp";

describe("timestamp", () => {
    test("has expected min value", () => {
        const value = minTimestamp("min-test");
        expect(timestampToString(value)).toBe("00000101000000000000000@min-test");
    });

    test("has expected max value", () => {
        const value = maxTimestamp("max-test");
        expect(timestampToString(value)).toBe("99991231235959999999999@max-test");
    });

    test("has expected epoch start", () => {
        const value = [0, 0, "epoch-test"] as Timestamp;
        expect(timestampToString(value)).toBe("19700101000000000000000@epoch-test");
        expect(timestampToDate(value).getTime()).toBe(0);
    });

    test("has the expected sort order", () => {
        const minA = minTimestamp("a");
        const minB = minTimestamp("b");
        const epoch = [0, 0, "c"] as Timestamp;
        const max0 = maxTimestamp("0");
        const max1 = maxTimestamp("1");

        expect(compareTimestamps(minA, minA)).toBe(0);
        expect(compareTimestamps(minA, minB)).toBe(-1);
        expect(compareTimestamps(minA, epoch)).toBe(-1);
        expect(compareTimestamps(minA, max0)).toBe(-1);
        expect(compareTimestamps(minA, max1)).toBe(-1);

        expect(compareTimestamps(minB, minA)).toBe(1);
        expect(compareTimestamps(minB, minB)).toBe(0);
        expect(compareTimestamps(minB, epoch)).toBe(-1);
        expect(compareTimestamps(minB, max0)).toBe(-1);
        expect(compareTimestamps(minB, max1)).toBe(-1);

        expect(compareTimestamps(epoch, minA)).toBe(1);
        expect(compareTimestamps(epoch, minB)).toBe(1);
        expect(compareTimestamps(epoch, epoch)).toBe(0);
        expect(compareTimestamps(epoch, max0)).toBe(-1);
        expect(compareTimestamps(epoch, max1)).toBe(-1);

        expect(compareTimestamps(max0, minA)).toBe(1);
        expect(compareTimestamps(max0, minB)).toBe(1);
        expect(compareTimestamps(max0, epoch)).toBe(1);
        expect(compareTimestamps(max0, max0)).toBe(0);
        expect(compareTimestamps(max0, max1)).toBe(-1);

        expect(compareTimestamps(max1, minA)).toBe(1);
        expect(compareTimestamps(max1, minB)).toBe(1);
        expect(compareTimestamps(max1, epoch)).toBe(1);
        expect(compareTimestamps(max1, max0)).toBe(1);
        expect(compareTimestamps(max1, max1)).toBe(0);
    });
});
