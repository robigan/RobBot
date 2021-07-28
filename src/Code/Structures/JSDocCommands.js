/* eslint-disable no-unused-vars */
/**
 * @typedef {{"description": ?string, "category": ?("Miscellaneous" | "Fun" | "Main" | "Utility" | "Test" | "Games" | "Other shotty category I couldn't think of a name for"), "man": string, "type": ?("global" | "guild"), "guild_id": ?string, "options": ?import("@amanda/discordtypings").ApplicationCommandOption, "default_permission": ?boolean, "name": string}} options
 */

/**
 * @typedef {Object} command
 * @property {options} options
 * @property {function(import("@amanda/discordtypings").InteractionData, import("cloudstorm/dist/Types").IWSMessage): void} command
 */

/**
 * @extends {Map<string, command>}
 */
module.exports.cMap = class cMap extends Map {
    /** @param {Iterable<readonly [string, command]>} entries */
    constructor(entries) {
        super(entries);
    }
};

/** @type {options} */
module.exports.optionsExample = {
    "category": "Other shotty category I couldn't think of a name for",
    "default_permission": true,
    "description": "A strange example command",
    "man": "The man page for this strange example command, the usage is null",
    "name": "strange",
    "options": [],
    "type": "global"
};