const RainCache = require("raincache");
// Load the Amqp Connector
const AmqpConnector = RainCache.Connectors.AmqpConnector;
// Load the redis storage engine class
const RedisStorageEngine = RainCache.Engines.RedisStorageEngine;
// Create a new uninitialized RainCache instance, set redis as the default storage engine,
// disable debugging mode and pass an inbound and an outbound connector to receive and forward events

module.exports = class CacheClient extends RainCache {
    /**
     * @constructor
     * @param {object} Config
     */
    constructor(Config) {
        Config.Engines.forEach(Unit => {
            if (!(Unit.type === "redis")) return;
            Config.RainCache.storage[Unit.engineType] = new RedisStorageEngine(Unit.options);
        }); // Create module system and use formatting modules from there

        /**
         * Format the config used for amqp into a suitable one used by RainCache's AmqpConnector
         * @param {string | object} amqp
         * @param {string} queueGatewayCache
         * @param {string} queueCacheCode
         * @returns {object} AmqpConnector options payload
         */
        const Format = (amqp, queueGatewayCache, queueCacheCode) => {
            const Formatted = {};
            Formatted.amqpUrl = amqp;
            Formatted.amqpQueue = queueGatewayCache;
            Formatted.sendQueue = queueCacheCode;
        }; // Create module system and use formatting modules from there

        const Inbound = new AmqpConnector(Config.Inbound ?? Format(Config.amqp.connection, Config.amqp.queueGatewayCache, Config.amqp.queueGatewayCache));
        const Outbound = new AmqpConnector(Config.Outbound ?? Format(Config.amqp.connection, Config.amqp.queueGatewayCache, Config.amqp.queueGatewayCache));
        super(Config.RainCache, Inbound, Outbound);
        super.on("debug", console.log);
        this.Inbound = Inbound;
        this.Outbound = Outbound;
    }

    async start() {
        await this.Inbound.initialize();
        await this.Outbound.initialize();
        await super.initialize();
        console.log("Cache   : initialized");
    }
};