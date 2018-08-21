/** @internal */
export function bindFirst<TFirst, TRest extends any[], TResult>(
    func: (first: TFirst, ...rest: TRest) => TResult,
    first: TFirst,
): (...args: TRest) => TResult {
    return func.bind(undefined, first);
}
