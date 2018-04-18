import { LIB_NAME_LONG } from "../util/const";

/**
 * Options for {@link App} instances
 */
export interface IAppOptions {
    /**
     * The namespace realm.
     *
     * The realm value is used as a namespace for global resources, such as messages channels and local storage. Use a
     * custom value to isolate same-origin app instances from each other, which is helpful when writing tests.
     */
    realm?: string;
}

/**
 * The default {@link IAppOptions#realm} value
 */
export const DEFAULT_REALM = LIB_NAME_LONG;
