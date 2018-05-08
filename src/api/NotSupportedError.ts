import { AppError } from "../api";

export class NotSupportedError extends AppError {
    constructor() {
        super("Operation is not supported");
    }
}
