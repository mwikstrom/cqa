import { App } from "../public/App";

import { InternalOf } from "./InternalOf";
import { InternalQuery } from "./InternalQuery";

export class InternalApp extends InternalOf<App> {
    public registerObservedQuery(
        _: InternalQuery,
    ): () => void {
        // TODO: Implement query subscription
        return () => { /* no-op */ };
    }
}
