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
        });
        const Inbound = new AmqpConnector(Config.InboundConnector);
        const Outbound = new AmqpConnector(Object.assign({}.amqpUrl = Config.OutboundConnector, {}.sendQueue = Config.amqp.queueCacheCode, {}.amqpQueue = Config.amqp.queueGatewayCache));
        super(Config.RainCache, Inbound, Outbound);
        this.Inbound = Inbound;
        this.Outbound = Outbound;
    }

    async start() {
        //await this.Inbound.initialize();
        //await this.Outbound.initialize();
        await super.initialize();
        console.log("Cache initialized");
    }
};