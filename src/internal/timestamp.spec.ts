import {
    Timestamp,
} from "../api/timestamp";

import {
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
});
