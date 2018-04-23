import { AppError } from "./AppError";

export class DisposeError extends AppError {
    constructor() {
        super("Operation not allowed after dispose");
    }
}
