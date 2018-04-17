import { makeInternalOf } from "../util/internal";
import { IAppOptions } from "./IAppOptions";
import { InternalApp } from "./InternalApp";

const internalOf = makeInternalOf<App, InternalApp>(InternalApp);

export class App {
    public initialize = (options?: IAppOptions) => internalOf(this).initialize(options);

    public get realm() { return internalOf(this).realm; }
}
