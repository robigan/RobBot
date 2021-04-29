const RainCache = require("raincache");
// Load the Amqp Connector
const CustomConnector = require("./CustomConnector.js");
// Load the redis storage engine class
const RedisStorageEngine = RainCache.Engines.RedisStorageEngine;
// Create a new uninitialized RainCache instance, set redis as the default storage engine,
// disable debugging mode and pass an inbound and an outbound connector to receive and forward events

module.exports = class CacheClient extends RainCache {
    /**
     * @constructor
     * @param {object} Config
     */
    constructor(Config, AmqpClient) {
        Config.Engines.forEach(Unit => {
            if (!(Unit.type === "redis")) return;
            Config.RainCache.storage[Unit.engineType] = new RedisStorageEngine(Unit.options);
        }); // Create module system and use formatting modules from there

        const Connector = new CustomConnector(AmqpClient, Config.amqp);
        super(Config.RainCache, Connector, Connector);
        super.on("debug", console.log);
        this.Connector = Connector;
    }

    async start() {
        await this.Connector.initialize();
        await super.initialize();
        console.log("Cache   : initialized");
    }
};