import { AppError } from "./AppError";

export class NotAttachedError extends AppError {
    constructor() {
        super("Operation requires object to be attached to an App instance");
    }
}
