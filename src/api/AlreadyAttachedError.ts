import { AppError } from "../api";

/**
 * The error that is thrown when an attempt is made to attach an object to more than one app instance.
 */
export class AlreadyAttachedError extends AppError {
    constructor() {
        super("Object is already attached to another App instance");
    }
}
