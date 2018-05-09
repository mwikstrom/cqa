import {
    App,
    AppObject,
    CancelToken,
    CancelTokenSource,
    Query,
} from "../api";

import {
    DEBUG,
    InternalApp,
    InternalAppObject,
    InternalBase,
    InternalCancelToken,
    InternalCancelTokenSource,
    InternalQuery,
    invariant,
} from "../internal";

export function internalOf(pub: App): InternalApp;
export function internalOf(pub: CancelToken): InternalCancelToken;
export function internalOf(pub: CancelTokenSource): InternalCancelTokenSource;
export function internalOf(pub: Query): InternalQuery;
export function internalOf(pub: AppObject): InternalAppObject;
export function internalOf<T extends object>(pub: T): InternalBase<T> {
    const internalCtor = getInternalCtor(pub.constructor);
    const instanceMap = getInstanceMap<T>(internalCtor);
    let internal = instanceMap.get(pub);

    if (internal === undefined) {
        internal = new internalCtor(pub) as InternalBase<T>;

        if (DEBUG) {
            invariant(
                internal instanceof InternalBase && internal.pub === pub,
                `Unexpected internal object for ${pub.constructor.name}`,
            );
        }

        instanceMap.set(pub, internal);
    }

    return internal;
}

// tslint:disable-next-line
type PublicConstructor = Function;

interface InternalConstructor {
    new (pub: any): any;
}

const internalCtorMap = new Map<PublicConstructor, InternalConstructor>();
const ensureInternalCtorMapInitialized = () => {
    if (internalCtorMap.size === 0) {
        internalCtorMap
            .set(App, InternalApp)
            .set(AppObject, InternalAppObject)
            .set(CancelToken, InternalCancelToken)
            .set(CancelTokenSource, InternalCancelTokenSource)
            .set(Query, InternalQuery);
    }
};

const resolveInternalCtor = (
    constructor: PublicConstructor,
): InternalConstructor => {
    let mapped: InternalConstructor | undefined;

    ensureInternalCtorMapInitialized();

    for (
        let proto = constructor;
        typeof proto === "function" && mapped === undefined;
        proto = Object.getPrototypeOf(proto)
    ) {
        mapped = internalCtorMap.get(proto);
    }

    invariant(
        mapped !== undefined,
        `Unknown internal class for ${constructor.name}`,
    );

    return mapped!;
};

const internalCtorCache = new WeakMap<PublicConstructor, InternalConstructor>();
const getInternalCtor = (
    constructor: PublicConstructor,
): InternalConstructor => {
    let resolved = internalCtorCache.get(constructor);

    if (resolved === undefined) {
        internalCtorCache.set(constructor, resolved = resolveInternalCtor(constructor));
    }

    return resolved;
};

const classMap = new WeakMap<InternalConstructor, WeakMap<object, object>>();
const getInstanceMap = <T extends object>(
    constructor: InternalConstructor,
): WeakMap<T, InternalBase<T>> => {
    let instanceMap = classMap.get(constructor);

    if (instanceMap === undefined) {
        classMap.set(constructor, instanceMap = new WeakMap<object, object>());
    }

    return instanceMap as WeakMap<T, InternalBase<T>>;
};