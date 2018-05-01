import { AppError } from "./AppError";

export class CancelError extends AppError {
    constructor() {
        super("Operation was cancelled");
    }
}
