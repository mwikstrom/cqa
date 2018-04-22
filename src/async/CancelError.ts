export class CancelError extends Error {
    constructor(
        message: string = "Operation was cancelled",
    ) {
        super(message);
    }
}
