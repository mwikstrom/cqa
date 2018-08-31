import { JsonPatch, JsonPatchOperation } from "../api/json-patch";
import { IJsonArray, IJsonObject, JsonValue } from "../api/json-value";
import { cloneJson } from "./clone-json";
import { jsonEquals } from "./json-equals";

type JsonLocation = IJsonArrayLocation | IJsonObjectLocation;

interface IJsonArrayLocation {
    container: IJsonArray;
    key: number;
    type: "array";
}

interface IJsonAppendLocation {
    container: IJsonArray;
    key: "-";
    type: "array";
}

interface IJsonObjectLocation {
    container: IJsonObject;
    key: string;
    type: "object";
}

/** @internal */
export function patchJsonInPlace(
    root: JsonValue,
    patch: JsonPatch,
): JsonValue {
    let result = root;
    patch.forEach(operation => result = applyOperation(result, operation));
    return result;
}

function applyOperation(
    root: JsonValue,
    operation: JsonPatchOperation,
): JsonValue {
    function ensureString(value: JsonValue): string {
        if (typeof value === "string") {
            return value;
        } else {
            return invalidOperation();
        }
    }

    function ensureValue(value: JsonValue | undefined): JsonValue {
        if (typeof value !== "undefined") {
            return value;
        } else {
            return invalidOperation();
        }
    }

    function invalidOperation(): never {
        throw new Error(`Invalid patch operation: ${JSON.stringify(operation)}`);
    }

    switch (operation.op) {
        case "add": return applyAddOperation(
            root,
            ensureString(operation.path),
            ensureValue(operation.value),
        );

        case "copy": return applyCopyOperation(
            root,
            ensureString(operation.path),
            ensureString(operation.from),
        );

        case "move": return applyMoveOperation(
            root,
            ensureString(operation.path),
            ensureString(operation.from),
        );

        case "remove": return applyRemoveOperation(
            root,
            ensureString(operation.path),
        );

        case "replace": return applyReplaceOperation(
            root,
            ensureString(operation.path),
            ensureValue(operation.value),
        );

        case "test": return applyTestOperation(
            root,
            ensureString(operation.path),
            ensureValue(operation.value),
        );

        default: return invalidOperation();
    }
}

function applyAddOperation(
    root: JsonValue,
    path: string,
    value: JsonValue,
): JsonValue {
    if (path === "") {
        return value;
    }

    const location = selectLocationAllowAppend(root, path);

    if (location.type === "object") {
        location.container[location.key] = value;
    } else if (location.key === "-" || location.key === location.container.length) {
        location.container.push(value);
    } else if (location.key > location.container.length) {
        illegalLocation(path);
    } else {
        location.container.splice(location.key, 0, value);
    }

    return root;
}

function applyRemoveOperation(
    root: JsonValue,
    path: string,
): JsonValue {
    const location = selectExistingLocation(root, path);

    if (location.type === "object") {
        delete location.container[location.key];
    } else {
        location.container.splice(location.key, 1);
    }

    return root;
}

function applyReplaceOperation(
    root: JsonValue,
    path: string,
    value: JsonValue,
): JsonValue {
    if (path === "") {
        return value;
    }

    const location = selectExistingLocation(root, path);

    if (location.type === "object") {
        location.container[location.key] = value;
    } else {
        location.container[location.key] = value;
    }

    return root;
}

function applyMoveOperation(
    root: JsonValue,
    path: string,
    from: string,
): JsonValue {
    const value = selectValue(root, from);
    const temp = applyRemoveOperation(root, from);
    return applyAddOperation(temp, path, value);
}

function applyCopyOperation(
    root: JsonValue,
    path: string,
    from: string,
): JsonValue {
    const value = selectValue(root, from);
    const clone = cloneJson(value);
    return applyAddOperation(root, path, clone);
}

function applyTestOperation(
    root: JsonValue,
    path: string,
    value: JsonValue,
): JsonValue {
    const existing = selectValue(root, path);

    if (!jsonEquals(existing, value)) {
        throw new Error(`Expected ${JSON.stringify(value)} at "${path}" but found ${JSON.stringify(existing)}`);
    }

    return root;
}

function selectValue(
    root: JsonValue,
    path: string,
): JsonValue {
    let value = root;

    path.split("/").map(decodePointerSegment).slice(1).forEach(key => {
        let next: undefined | JsonValue;

        if (Array.isArray(value)) {
            if (isIndexKey(key)) {
                next = value[parseInt(key, 10)];
            }
        } else {
            // istanbul ignore else
            if (typeof value === "object" && value !== null) {
                next = value[key];
            }
        }

        if (next === undefined) {
            throw new Error(`Illegal path "${path}"`);
        }

        value = next;
    });

    return value;
}

function selectLocation(
    root: JsonValue,
    path: string,
): JsonLocation {
    const location = selectLocationAllowAppend(root, path);

    if (location.type === "array" && location.key === "-") {
        return illegalLocation(path);
    }

    return location as JsonLocation;
}

function selectExistingLocation(
    root: JsonValue,
    path: string,
): JsonLocation {
    const location = selectLocation(root, path);

    if ((location.type === "object" && location.container[location.key] === undefined) ||
        (location.type === "array" && location.container[location.key] === undefined)) {
        illegalLocation(path);
    }

    return location;
}

function selectLocationAllowAppend(
    root: JsonValue,
    path: string,
): JsonLocation | IJsonAppendLocation {
    const lastSlash = path.lastIndexOf("/");

    // istanbul ignore else
    if (lastSlash >= 0) {
        const container = selectValue(root, path.substr(0, lastSlash));
        const key = decodePointerSegment(path.substr(lastSlash + 1));

        if (Array.isArray(container)) {
            if (key === "-") {
                return {
                    container,
                    key,
                    type: "array",
                };
            } else if (isIndexKey(key)) {
                return {
                    container,
                    key: parseInt(key, 10),
                    type: "array",
                };
            }
        } else {
            // istanbul ignore else
            if (typeof container === "object" && container !== null) {
                return {
                    container: container as IJsonObject,
                    key,
                    type: "object",
                };
            }
        }
    }

    return illegalLocation(path);
}

function isIndexKey(
    key: string,
): boolean {
    return key === "0" || /^[1-9][0-9]*$/.test(key);
}

function decodePointerSegment(
    key: string,
): string {
    return key.replace(/~[01]/g, m => ["~", "/"][m === "~0" ? 0 : 1]);
}

function illegalLocation(
    path: string,
): never {
    throw new Error(`Operation cannot be applied at "${path}"`);
}
