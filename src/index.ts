/**
 * CQA - Command Query App
 * Copyright (c) Mårten Wikström 2018, MIT Licensed
 * https://github.com/mwikstrom/cqa
 */

// Run library initialization code first
/** @internal */
import "./utils/init";

// Import public API
export { IActiveCommandOptions } from "./datastore/active-command-options";
export { ICommandInput } from "./datastore/command-input";
export { IDatastore } from "./datastore/datastore";
export { IJsonArray, IJsonObject, isJsonValue, JsonValue } from "./common-types/json-value";
export { openDatastore } from "./datastore/open-datastore";
export { IPendingCommandOptions, SkipTargetPredicate } from "./datastore/pending-command-options";
export { IStoredCommand } from "./datastore/stored-command";
