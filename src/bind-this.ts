/** @internal */
export function bindThis<TArgs extends any[], TResult>(
    thisArg: any,
    func: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
    return func.bind(thisArg);
}
