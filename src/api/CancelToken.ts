import { when } from "mobx";

import { CancelError } from "../api";

import {
    demand,
    internalOf,
} from "../internal";

export class CancelToken {
    public static readonly Never = Object.freeze(new CancelToken());

    public get isCancelled(): boolean {
        return internalOf(this).isCancelled;
    }

    public get rejectWhenCancelled(): Promise<never> {
        return new Promise<never>((_, reject) => {
            when(
                () => this.isCancelled,
                () => reject(new CancelError()),
            );
        });
    }

    public throwIfCancelled(): void {
        demand(!this.isCancelled, CancelError);
    }

    public ignoreCancellation(promise: Promise<void>): Promise<void>;
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
