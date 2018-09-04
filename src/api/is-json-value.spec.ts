// tslint:disable:object-literal-sort-keys
// tslint:disable:max-classes-per-file

import { isJsonValue } from "./is-json-value";

const expect = chai.expect;

describe("isJsonValue", () => {
    const legal: any = {
        "boolean": true,
        "null": null,
        "integer": 123,
        "decimal": 1.23,
        "empty string": "",
        "non-empty string": "hello world",
        "array": [ true, null, 1.23, "" ],
        "object": { a: true, b: null, c: 1.23, d: "" },
        "nested": [ { "": [ null ] } ],
    };

    const illegal: any = {
        "symbol": Symbol("illegal"),
        "date": new Date(),
        "regex": /illegal/,
        "nan": NaN,
        "infinity": Infinity,
        "class": class {},
        "instance of class": new (class {})(),
        "function": () => 0,
        "array": [ true, null, 1.23, NaN, "" ],
        "object": { a: true, b: null, c: 1.23, d: NaN, e: "" },
        "nested": [ { "": [ NaN ] } ],
    };

    Object.keys(legal).forEach(key => it(
        `is true for ${key}`,
        () => expect(isJsonValue(legal[key])).to.eq(true),
    ));

    Object.keys(illegal).forEach(key => it(
        `is false for ${key}`,
        () => expect(isJsonValue(illegal[key])).to.eq(false),
    ));
});
