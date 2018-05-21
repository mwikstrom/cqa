import { AppError } from "../api";

/**
 * The error that is thrown when trying to access the app of an object that is not attached to an app.
 */
export class NotAttachedError extends AppError {
    constructor() {
        super("Operation requires object to be attached to an App instance");
    }
}
