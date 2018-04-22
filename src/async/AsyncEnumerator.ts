import { CancelToken } from "./CancelToken";

export abstract class AsyncEnumerator<T> {
    public abstract next(token?: CancelToken): Promise<T | undefined>;
}
