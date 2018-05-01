import { when } from "mobx";

import { demand } from "../internal/Demand";
import { InternalCancelToken } from "../internal/InternalCancelToken";
import { makeInternalOf } from "../internal/InternalOf";

import { CancelError } from "./CancelError";

export class CancelToken {
    public static readonly Never = Object.freeze(new CancelToken());

    public get isCancelled(): boolean {
        return internalOf(this).isCancelled;
    }

    public get rejectWhenCancelled(): Promise<never> {
        return new Promise<never>((_, reject) => {
            when(
                () => this.isCancelled === true,
                () => reject(new CancelError()),
            );
        });
    }

    public throwIfCancelled(): void {
        demand(!this.isCancelled, CancelError);
    }
}

const internalOf = makeInternalOf<CancelToken, InternalCancelToken>(CancelToken, InternalCancelToken);
