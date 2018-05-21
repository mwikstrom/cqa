/**
 * The base class for errors thrown by the app framework
 */
export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
