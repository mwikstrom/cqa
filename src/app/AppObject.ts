import { makeInternalOf } from "../utils/internal";
import { App } from "./App";
import { InternalAppObject } from "./InternalAppObject";

export class AppObject<TApp extends App = App> {
    /**
     * Gets the {@link App} instance that the current object is attached to. (Observable)
     *
     * @throws {NotAttachedError} when {@link AppObject#isAttached} is `false`
     */
    public get app(): TApp {
        return internalOf(this).app as TApp;
    }

    /**
     * Determines whether the current object is attached to an {@link App} instance. (Observable)
     */
    public get isAttached(): boolean {
        return internalOf(this).isAttached;
    }

    /**
     * Attaches the current object to the specified {@link App} instance.
     *
     * @param app The app instance to attach to
     * @throws {AlreadyAttachedError} when the current object is attached to another {@link App} instance
     * @throws {DisposeError} when the specified {@link App} instance is disposed
     */
    public attachTo(app: TApp): this {
        internalOf(this).attachTo(app);
        return this;
    }
}

const internalOf = makeInternalOf<AppObject, InternalAppObject>(AppObject, InternalAppObject);
