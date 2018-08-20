export function bindFirst<TFirst, TRest extends any[], TResult>(
    func: (first: TFirst, ...rest: TRest) => TResult,
    first: TFirst,
): (...args: TRest) => TResult {
    return func.bind(undefined, first);
}

export function bindThis<TArgs extends any[], TResult>(
    thisArg: any,
    func: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
    return func.bind(thisArg);
}
