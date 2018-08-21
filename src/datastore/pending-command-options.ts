import * as t from "io-ts";
import { PositiveInteger } from "../common-types/positive-integer";

/** @public */
export interface IPendingCommandOptions {
    maxTargets?: number;
    skipTarget?: SkipTargetPredicate;
}

/** @public */
export type SkipTargetPredicate = (target: string) => boolean;

/** @internal */
export const PendingCommandOptionsType = t.partial({
    maxTargets: PositiveInteger,
    skipTargets: t.Function,
});
