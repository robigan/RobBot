const RainCache = require("raincache");
const CustomConnector = require("./CustomConnector.js");
const RedisStorageEngine = RainCache.Engines.RedisStorageEngine;
const Config = Object.assign(require("./manifest.json").config, require(global.robbotInstances.get("robigan.config").modulePath));

/**
 * CacheClient class
 * @extends {import("raincache")}
 */
class CacheClient extends RainCache {
    /**
     * Initiate the caching service for RobBot
     * @constructor
     * @param {object} Config
     */
    constructor(Config) {
        Config.Engines.forEach(Unit => {
            if (!(Unit.type === "redis")) return;
            Config.RainCache.storage[Unit.engineType] = new RedisStorageEngine(Unit.options);
        }); // Create module system and use formatting modules from there

        const Connector = new CustomConnector(global.robbotAmqpClient, Config.amqp);
        super(Config.RainCache, Connector, Connector);
        Config.debug.cache ? super.on("debug", console.warn) : undefined;
        this.Connector = Connector;
    }

    /**
     * Start function
     * @async
     * @function
     */
    async start() {
        await this.Connector.initialize();
        await super.initialize();
    }
}

const Cache = new CacheClient(Config);
Cache.start();
Config.debug.init ? console.log("Cache   : started") : undefined;