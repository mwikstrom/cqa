import { Command } from "../command/Command";
import { ReadonlyJsonValue } from "../utils/json";

/**
 * Provides live results for a {@link Query}.
 */
export abstract class View {
    /**
     * Creates a readonly data snapshot for the current view.
     *
     * It is assumed that the returned snapshot contains all relevant view state, so that another view instance of the
     * same class as the current view would provide the same information set if the retuned snapshot was applied to it
     * by calling {@link View#onSnapshot}.
     */
    public abstract createSnapshot(): ReadonlyJsonValue;

    /**
     * Applies the effect of the specified command to the current view.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the CQA framework.
     *
     * @param command The command to be applied
     *
     * @returns `true` when the specified command affected the current view; otherwise `false`.
     */
    public abstract onCommand(
        command: Command,
    ): boolean;

    /**
     * Applies the specified snapshot to the current view. It is assumed that information set provided by the current
     * view is completely reset by the specified snapshot.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the CQA framework.
     *
     * @param data The snapshot data to be applied.
     */
    public abstract onSnapshot(
        data: ReadonlyJsonValue,
    ): void;

    /**
     * Applies the specified update to the current view.
     *
     * WARNING: Do not call this method directly from your code. It shall only be invoked from the CQA framework.
     *
     * @param data The update data to be applied.
     */
    public abstract onUpdate(
        data: ReadonlyJsonValue,
    ): void;
}
