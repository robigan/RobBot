/**
 * @typedef {Object} structMap
 * @property {import("./MessageEmbed.js")} MessageEmbed
 * @property {import("./EventHandler.js")} EventHandler
 * @property {import("./Util.js")} Utils
 * @property {import("../../Database/Database.js")} Database
 * @property {import("../../amqp/AmqpClient.js")} AmqpClient
 * @property {import("raincache")} RainCache
 * @property {import("./InteractionPipeline.js")} IntPi
 * @property {import("../../../LocationResolver.js")} LocRes
 */

/**
 * @extends {Map<keyof structMap, structMap[keyof structMap]>}
 */
// eslint-disable-next-line no-unused-vars
class SMap extends Map {
    /** @param {Iterable<readonly [keyof structMap, structMap[keyof structMap]]>} entries */
    constructor(entries) {
        super(entries);
    }

    /**
     * @template {keyof structMap} K2
     * @param {K2} key
     * @returns {structMap[K2]}
     */
    get(key) {
        return super.get(key);
    }
}

module.exports = SMap;