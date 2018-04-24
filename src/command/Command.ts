import { App, AppObject } from "../app";
import { ReadonlyJsonValue } from "../utils/json";

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a data object that completely describe the current command.
     */
    public abstract get commandData(): ReadonlyJsonValue;
}
