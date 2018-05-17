import {
    App,
    AppObject,
    ReadonlyJsonValue,
} from "../api";

import {
    internalOf,
} from "../internal";

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a descriptor (a json value) that describe this command object.
     */
    public get descriptor(): ReadonlyJsonValue {
        return internalOf(this).descriptor;
    }

    /**
     * Gets a unique command identifier.
     */
    public get id(): string {
        return internalOf(this).id;
    }

    /**
     * Creates a descriptor (a json value) that describe this command object.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;
}
