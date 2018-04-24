import { makeCheckThis } from "../utils/binding";
import { makeInternalOf } from "../utils/internal";
import { IAppOptions } from "./IAppOptions";
import { InternalApp } from "./InternalApp";

/**
 * Command Query App root object
 */
export class App {
    /**
     * Determines whether the current {@link App} instance has been locked for further configuration. (Observable)
     */
    public get isConfigurationLocked(): boolean {
        return internalOf(this).isConfigurationLocked;
    }

    /**
     * Determines whether the current {@link App} instance has been disposed. (Observable)
     */
    public get isDisposed(): boolean {
        return internalOf(this).isDisposed;
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
     * Configures the current {@link App} instance.
     *
     * @param {IAppOptions} options Configuration options
     *
     * @throws {DisposeError} when {@link App#isDisposed} is `true`.
     * @throws {ConfigurationLockError} when {@link App#isConfigurationLocked} is `true`.
     */
    public configure(
        options: IAppOptions,
    ): this {
        internalOf(this).configure(options);
        return this;
    }

    /**
     * Releases any resources held by the current {@link App} instances.
     */
    public dispose(): this {
        internalOf(this).dispose();
        return this;
    }

    /**
     * Prevents further configuration of the current {@link App} instance.
     */
    public lockConfiguration(): this {
        internalOf(this).lockConfiguration();
        return this;
    }
}

const checkThis = makeCheckThis(App);

const uncheckedInternalOf = makeInternalOf<App, InternalApp>(InternalApp);

const internalOf = (thisArg: App) => {
    checkThis(thisArg);
    return uncheckedInternalOf(thisArg);
};
