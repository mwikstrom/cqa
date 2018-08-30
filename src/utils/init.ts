//
// Make sure that we have a `process.env` object. We'll read `NODE_ENV` from that object to distinguish between
// production and non-production (DEBUG) bundles.
//
// istanbul ignore next
if (typeof (self as any).process !== "object") {
    // @ts-ignore
    (self as any).process = { env: { } };
} else if (typeof (self as any).process.env !== "object") {
    (self as any).process.env = {};
}

import {
    DEBUG,
    LIB_NAME_SHORT,
} from "./env";

//
// Print a warning when a DEBUG mode (non-production) bundle is minified.
//
// istanbul ignore next
(() => {
    function this_name_shall_be_minified_in_production() { /* no-op */ }

    if (DEBUG && this_name_shall_be_minified_in_production.name !== "this_name_shall_be_minified_in_production") {
        // tslint:disable-next-line:no-console
        console.warn(`[${LIB_NAME_SHORT}]: you should set 'process.env.NODE_ENV' to 'production' in your bundler.`);
    }
})();
