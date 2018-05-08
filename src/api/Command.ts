import {
    App,
    AppObject,
    ReadonlyJsonValue,
} from "../api";

// TODO: Pushing a command; snapshot active queries. Apply locally. Store in local db. Broadcast (cross tabs).
//       Send to server. Track accept/reject. Views need to keep applying command until commit version is reached.

export abstract class Command<TApp extends App = App> extends AppObject<TApp> {
    /**
     * Gets a data object that completely describe the current command.
     */
    public abstract get commandData(): ReadonlyJsonValue;
}
