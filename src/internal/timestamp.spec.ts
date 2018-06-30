import {
    Timestamp,
} from "../api/timestamp";

import {
    compareTimestamps,
    isTimestamp,
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

    test("has expected sort order", () => {
        const minA = minTimestamp("a");
        const minB = minTimestamp("b");
        const epoch = [0, 0, "c"] as Timestamp;
        const epoch1 = [0, 1, "c"] as Timestamp;
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
        expect(compareTimestamps(epoch, epoch1)).toBe(-1);
        expect(compareTimestamps(epoch1, epoch)).toBe(1);
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

    test("can compare dates", () => {
        const date0 = new Date(0);
        const date1 = new Date(1);
        const ts0 = [ 0, 0, "x" ] as Timestamp;
        const ts1 = [ 0, 1e6 - 1, "x"] as Timestamp;
        const ts2 = [ 0, 1e6, "x"] as Timestamp;

        expect(compareTimestamps(date0, date0)).toBe(0);
        expect(compareTimestamps(date0, ts0)).toBe(0);
        expect(compareTimestamps(ts0, date0)).toBe(0);
        expect(compareTimestamps(ts0, ts0)).toBe(0);

        expect(compareTimestamps(ts1, date0)).toBe(0);
        expect(compareTimestamps(ts1, date1)).toBe(-1);
        expect(compareTimestamps(ts2, date1)).toBe(0);
    });

    describe("isTimestamp", () => {
        test("min is ok", () => {
            const value = minTimestamp("x");
            expect(isTimestamp(value)).toBe(true);
        });

        test("max is ok", () => {
            const value = maxTimestamp("x");
            expect(isTimestamp(value)).toBe(true);
        });

        test("epoch is ok", () => {
            const value = [ 0, 0, "x" ] as Timestamp;
            expect(isTimestamp(value)).toBe(true);
        });

        test("negative nanos is not ok", () => {
            const value = [ 0, -1, "x" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("nano overflow is not ok", () => {
            const value = [ 0, 1e9, "x" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("secs undeflow is not ok", () => {
            const value = [ -62167219201, 0, "x" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("secs overflow is not ok", () => {
            const value = [ 253402300800, 0, "x" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("empty generator id is not ok", () => {
            const value = [ 0, 0, "" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("malformed generator id is not ok", () => {
            const value = [ 0, 0, "ab/cd" ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("long generator id is ok", () => {
            const value = [ 0, 0, "a".repeat(50) ] as Timestamp;
            expect(isTimestamp(value)).toBe(true);
        });

        test("too long generator id is not ok", () => {
            const value = [ 0, 0, "a".repeat(51) ] as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });

        test("missing generator id is not ok", () => {
            const value = [ 0, 0 ] as any as Timestamp;
            expect(isTimestamp(value)).toBe(false);
        });
    });
});
