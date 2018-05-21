import { ISimpleConsole } from "../api";

/**
 * Provides {@link App} configuration options
 */
export interface IAppOptions {
    /**
     * The console that shall be used for diagnostic messages
     */
    console?: ISimpleConsole;

    /**
     * The local realm that shall be used to scope locally shared resources
     */
    localRealm?: string;
}
