import { when } from "mobx";

import { CancelError } from "../error/CancelError";
import { demand } from "../utils/demand";
import { makeInternalOf } from "../utils/internal";
import { InternalCancelToken } from "./InternalCancelToken";

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
