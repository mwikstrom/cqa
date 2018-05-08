import { AppError } from "../api";

export class CancelError extends AppError {
    constructor() {
        super("Operation was cancelled");
    }
}
