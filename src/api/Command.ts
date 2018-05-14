import {
    App,
    AppObject,
    ReadonlyJsonValue,
} from "../api";

import {
    internalOf,
} from "../internal";

// TODO: Pushing a command; snapshot active queries. Apply locally. Store in local db. Broadcast (cross tabs).
//       Send to server. Track accept/reject. Views need to keep applying command until commit version is reached.

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a descriptor (a json value) that describe this command object.
     */
    public get descriptor(): ReadonlyJsonValue {
        return internalOf(this).descriptor;
    }

    /**
     * Creates a descriptor (a json value) that describe this command object.
     */
    public abstract buildDescriptor(): ReadonlyJsonValue;
}
