/**
 * Represents a global version token
 */
export abstract class Version {
    /**
     * Determines whether the current version is after the specified other version.
     *
     * @param other The other version to compare with the current version.
     */
    public abstract isAfter(other: Version): boolean;

    /**
     * Determines whether the current version is after or equal to the specified other version.
     *
     * @param other The other version to compare with the current version.
     */
    public isAfterOrEqualTo(other: Version): boolean {
        return this.isAfter(other) || this.isEqualTo(other);
    }

    /**
     * Determines whether the current version is before the specified other version.
     *
     * @param other The other version to compare with the current version.
     */
    public isBefore(other: Version): boolean {
        return !this.isAfterOrEqualTo(other);
    }

    /**
     * Determines whether the current version is before or equal to the specified other version.
     *
     * @param other The other version to compare with the current version.
     */
    public isBeforeOrEqualTo(other: Version): boolean {
        return !this.isAfter(other);
    }

    /**
     * Determines whether the current version is equal to the specified other version.
     *
     * @param other The other version to compare with the current version.
     */
    public abstract isEqualTo(other: Version): boolean;
}
