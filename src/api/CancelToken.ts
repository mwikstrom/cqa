import { when } from "mobx";

import { CancelError } from "../api";

import {
    demand,
    internalOf,
} from "../internal";

// tslint:disable-next-line
export type Func = Function;

/**
 * Propagates notification that operations should be canceled.
 */
export class CancelToken {
    public static readonly Never = Object.freeze(new CancelToken());

    /**
     * Determines whether operations that observe this token should be cancelled.
     */
    public get isCancelled(): boolean {
        return internalOf(this).isCancelled;
    }

    /**
     * Gets a promise that is never resolved but rejected when this token is cancelled.
     */
    public get rejectWhenCancelled(): Promise<never> {
        return new Promise<never>((_, reject) => {
            when(
                () => this.isCancelled,
                () => reject(new CancelError()),
            );
        });
    }

    /**
     * Decorates the specified function with a dependency on this cancellation token.
     *
     * @param func The function to decorate
     * @param thisArg The object to be used as the `this` object
     * @returns A function that throws a {@link CancelError} when called after this token is cancelled and otherwise
     *          delegates to the specified func.
     */
    public bind<T extends Func>(
        func: T,
        thisArg?: any,
    ): T {
        return ((...argArray: any[]) => {
            this.throwIfCancelled();
            return func.apply(thisArg, argArray);
        }) as Func as T;
    }

    /**
     * Throws a {@link CancelError} when this token is cancelled.
     */
    public throwIfCancelled(): void {
        demand(!this.isCancelled, CancelError);
    }

    /**
     * Returns a new promise that extend the specified promise to ignore {@link CancelError} rejections
     * when this token is cancelled.
     *
     * @param promise The promise that shall ignore cancellation.
     */
    public ignoreCancellation(promise: Promise<void>): Promise<void>;

    /**
     * Returns a new promise that extend the specified promise to ignore {@link CancelError} rejections
     * when this token is cancelled.
     *
     * @param promise The promise that shall ignore cancellation.
     * @param onCancel The returned promise shall be resolved with this value when ignoring a cancellation rejection.
     */
    public ignoreCancellation<T>(promise: Promise<T>, onCancel: T): Promise<T>;
    public async ignoreCancellation<T>(promise: Promise<T>, onCancel?: T): Promise<T> {
        try {
            return await promise;
        } catch (error) {
            if (error instanceof CancelError && this.isCancelled) {
                return onCancel!;
            } else {
                throw error;
            }
        }
    }
}
