const RainCache = require("raincache");
// Load the Amqp Connector
const AmqpConnector = RainCache.Connectors.AmqpConnector;
// Load the redis storage engine class
const RedisStorageEngine = RainCache.Engines.RedisStorageEngine;
// Use the default options and create a new connector which isn't connected yet
const Inbound = new AmqpConnector();
const Outbound = new AmqpConnector();
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
        super(Config.RainCache, Inbound, Outbound);
    }

    async start() {
        const init = async () => {
            // initialize the cache, the connector and the database connection
            await super.initialize();
        };
        // Declare an asynchronous init method
        init().then(() => {
            console.log("Cache initialized");
        }).catch(e => console.error(e));
        // Run the init function
    }
};