import { AppError } from "../api";

/**
 * The error that is thrown when an attempt is made to perform an operation that is not supported.
 */
export class NotSupportedError extends AppError {
    constructor() {
        super("Operation is not supported");
    }
}
