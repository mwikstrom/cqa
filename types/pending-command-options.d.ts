/** @public */
export interface IPendingCommandOptions {
    maxTargets?: number;
    skipTarget?: SkipTargetPredicate;
}
/** @public */
export declare type SkipTargetPredicate = (target: string) => boolean;
