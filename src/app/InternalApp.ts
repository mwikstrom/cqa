import { InternalOf } from "../util/internal";
import { App } from "./App";
import {
    DEFAULT_REALM,
    IAppOptions,
} from "./IAppOptions";

export class InternalApp extends InternalOf<App> {
    public realm = DEFAULT_REALM;

    public initialize(options?: IAppOptions) {
        const {
            realm = DEFAULT_REALM,
        } = options || {};

        this.realm = realm;
    }
}
