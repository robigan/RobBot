/* eslint-disable no-unused-vars */
const CodeModule = class CodeModule {
    async moduleWillLoad() {}
    async moduleWillUnload() {}
};

/**
 * @typedef {{"id": string, "name": ?string, "version": string, "description": ?string, "author": ?string, "entryPath": string, "config": ?Object, "type": ("executable" | "dependency" | "other" | "selectable"), "manPage": ?(Array<string> | string )}} manifest
 */

/**
 * @typedef {Object} customModule
 * @property {CodeModule} module
 * @property {manifest} manifest
 */

/**
 * @extends {Map<customModule.manifest.id, customModule>}
 */
module.exports.mMap = class mMap extends Map {
    /** @param {Iterable<readonly [customModule.manifest.id, customModule]>} entries */
    constructor(entries) {
        super(entries);
    }
};

/** @type {manifest} */
module.exports.manifestExample = {
    "id": "robigan.jsdocexample",
    "name": "JSDoc Example",
    "version": "1.0.0",
    "description": "A module for providing JSDoc types and stuff",
    "author": "robigan#1634",
    "entryPath": "/index.js",
    "config": {
        "someRandomCmdID": "696969696969696969"
    },
    "type": "other"
};