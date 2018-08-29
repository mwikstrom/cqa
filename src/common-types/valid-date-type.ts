import * as t from "io-ts";
import { InstanceOf } from "./instance-of";

/** @internal */
export const ValidDateType = t.refinement(
    InstanceOf<DateConstructor, [number], Date>(Date),
    value => !isNaN(value.getTime()),
    "valid date",
);
