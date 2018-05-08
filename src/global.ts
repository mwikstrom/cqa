import {
    DEBUG,
    LIB_NAME_SHORT,
} from "./internal";

if (typeof process !== "object") {
    process = { env: { } };
} else if (typeof process.env !== "object") {
    process.env = {};
}

(() => {
    function this_name_shall_be_minified_in_production() { /* no-op */ }

    if (DEBUG && this_name_shall_be_minified_in_production.name !== "this_name_shall_be_minified_in_production") {
        /* tslint:disable-next-line */
        console.warn(`[${LIB_NAME_SHORT}]: you should set 'process.env.NODE_ENV' to 'production' in your bundler.`);
    }
})();
