import { ReadonlyJsonValue } from "../utils/json";

export abstract class Command {
    /**
     * Gets a data object that completely describe the current command.
     */
    public abstract get commandData(): ReadonlyJsonValue;
}
