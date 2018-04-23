import { ReadonlyJsonValue } from "../utils/json";

export abstract class View {
    public abstract applyCommand(
        target: string,
        type: string,
        data: ReadonlyJsonValue,
    ): boolean;

    public abstract applySnapshot(
        data: ReadonlyJsonValue,
    ): void;

    public abstract applyUpdate(
        data: ReadonlyJsonValue,
    ): void;

    public abstract createSnapshot(): ReadonlyJsonValue;
}
