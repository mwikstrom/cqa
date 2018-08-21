import { NonEmptyString } from "./non-empty-string";

/** @internal */
export function isValidStatusAndCommit(
    status: string,
    commit: string | undefined,
): boolean {
    switch (status) {
        // Pending and rejected commands cannot have a commit version
        case "pending":
        case "rejected":
            return commit === undefined;

        // Accepted commands must have a non-empty commit version
        case "accepted":
            return NonEmptyString.is(commit);

        // Any other status is illegal
        default:
            return false;
    }
}
