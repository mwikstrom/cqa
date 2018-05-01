import { App } from "./App";
import { AppObject } from "./AppObject";
import { ReadonlyJsonValue } from "./Json";

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a data object that completely describe the current command.
     */
    public abstract get commandData(): ReadonlyJsonValue;
}
