/**
 * Provides a diagnostic message sink
 */
export interface ISimpleConsole {
    /**
     * Prints a warning message.
     *
     * @param message The warning message to display.
     */
    warn(message: string): void;
}
