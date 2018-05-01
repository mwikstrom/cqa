import { AppError } from "./AppError";

export class ConfigurationLockError extends AppError {
    constructor() {
        super("Configuration is locked");
    }
}
