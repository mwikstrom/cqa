import { when } from "mobx";

import { makeCheckThis } from "../utils/binding";
import { makeInternalOf } from "../utils/internal";
import { CancelError } from "./CancelError";
import { InternalCancelToken } from "./InternalCancelToken";

export class CancelToken {
    public static readonly Never = Object.freeze(new CancelToken());

    public get isCancelled(): boolean {
        return internalOf(this).isCancelled;
    }

    public get rejectWhenCancelled(): Promise<never> {
        return new Promise<never>((_, reject) => {
            checkThis(this);
            when(
                () => this.isCancelled === true,
                () => reject(new CancelError()),
            );
        });
    }

    public throwIfCancelled(): void {
        checkThis(this);

        if (this.isCancelled) {
            throw new CancelError();
        }
    }
}

const checkThis = makeCheckThis(CancelToken);

const uncheckedInternalOf = makeInternalOf<CancelToken, InternalCancelToken>(InternalCancelToken);

const internalOf = (thisArg: CancelToken) => {
    checkThis(thisArg);
    return uncheckedInternalOf(thisArg);
};
