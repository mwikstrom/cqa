import { AppError } from "../api";

/**
 * The error that is thrown when an operation is cancelled.
 */
export class CancelError extends AppError {
    constructor() {
        super("Operation was cancelled");
    }
}
