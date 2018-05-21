import { IReactionDisposer, when } from "mobx";

import { CancelToken } from "../api";

import { internalOf } from "../internal";

/**
 * Provides a {@link CancelToken} and the ability to mark it as cancelled.
 */
export class CancelTokenSource {
    /**
     * Gets the provided token
     */
    public get token(): CancelToken {
        return internalOf(this).token;
    }

    /**
     * Marks the provided token as cancelled
     */
    public cancel(): this {
        internalOf(this).cancel();
        return this;
    }

    /**
     * Marks the provided token as cancelled when the specified predicate returns true.
     *
     * @param predicate The callback function that determines whether the provided token shall be cancelled.
     * @returns A function that can be called to stop the specified predicate from cancelling the provided token.
     */
    public cancelWhen(
        predicate: () => boolean,
    ): IReactionDisposer {
        return when(predicate, () => this.cancel());
    }
}
