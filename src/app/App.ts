import { makeCheckThis } from "../utils/binding";
import { makeInternalOf } from "../utils/internal";
import { AppState } from "./AppState";
import { IAppOptions } from "./IAppOptions";
import { InternalApp } from "./InternalApp";

/**
 * Command Query App root object
 */
export class App {
    /**
     * The App's current life cycle state. (Observable)
     *
     * @see {AppState}
     */
    public get state(): AppState {
        return internalOf(this).state;
    }

    /**
     * The namespace realm. (Observable)
     *
     * The realm value is used as a namespace for global resources, such as messages channels and local storage. Set a
     * custom value (as an option to {@link App#initialize}) to isolate same-origin app instances from each other,
     * which is helpful when writing tests.
     */
    public get realm(): string {
        return internalOf(this).realm;
    }

    /**
     * Initializes the current {@link App} instance.
     *
     * @param {IAppOptions} options Optional initialization options
     */
    public async initialize(
        options?: IAppOptions,
    ): Promise<this> {
        await internalOf(this).initialize(options);
        return this;
    }

    /**
     * Diposes the current {@link App} instance and releases any resources that it currently holds, for example
     * back end connections, local message channels and local storage objects.
     *
     * @see {App#isDisposed}
     */
    public async dispose(): Promise<this> {
        await internalOf(this).dispose();
        return this;
    }
}

const checkThis = makeCheckThis(App);

const uncheckedInternalOf = makeInternalOf<App, InternalApp>(InternalApp);

const internalOf = (thisArg: App) => {
    checkThis(thisArg);
    return uncheckedInternalOf(thisArg);
};
