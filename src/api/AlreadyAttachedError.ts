import { AppError } from "../api";

export class AlreadyAttachedError extends AppError {
    constructor() {
        super("Object is already attached to another App instance");
    }
}
