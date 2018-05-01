import { AppError } from "./AppError";

export class NotSupportedError extends AppError {
    constructor() {
        super("Operation is not supported");
    }
}
