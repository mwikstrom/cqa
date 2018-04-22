import { makeCheckThis } from "../utils/binding";
import { makeInternalOf } from "../utils/internal";
import { CancelToken } from "./CancelToken";
import { InternalCancelTokenSource } from "./InternalCancelTokenSource";

export class CancelTokenSource {
    public get token(): CancelToken {
        return internalOf(this).token;
    }

    public cancel(): void {
        internalOf(this).cancel();
    }
}

const checkThis = makeCheckThis(CancelTokenSource);

const uncheckedInternalOf = makeInternalOf<CancelTokenSource, InternalCancelTokenSource>(InternalCancelTokenSource);

const internalOf = (thisArg: CancelTokenSource) => {
    checkThis(thisArg);
    return uncheckedInternalOf(thisArg);
};
