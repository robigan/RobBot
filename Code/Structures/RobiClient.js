const SnowTransfer = require("snowtransfer");
const RainCache = require("raincache");
//const MongoDB = require("mongodb");
const Util = require("./Util.js");

module.exports = class RobiClient extends SnowTransfer {
    /**
     * Initiate the RobiClient for RobBot
     * @constructor
     * @param {Object} config 
     * @param {import("../../amqp/AmqpClient")} AmqpClient 
     */
    constructor(config = {}, AmqpClient) {
        super(config.token, config.SnowTransfer);
        this.validate(config);

        this.AmqpClient = AmqpClient;

        this.Identify = {
            "ownerBot": config.ownerbot,
            "token": config.token,
            "selfID": "",
            "prefix": config.prefix
        };

        const RainCacheConfig = require("../../Configs/CacheClient.json");
        RainCacheConfig.Engines.forEach(Unit => {
            if (!(Unit.type === "redis")) return;
            RainCacheConfig.RainCache.storage[Unit.engineType] = new RainCache.Engines.RedisStorageEngine(Unit.options);
        });
        this.RainCache = new RainCache({
            storage: {
                default: new RainCache.Engines.RedisStorageEngine({
                    redisOptions: {
                        host: "localhost"
                    }
                })
            }, debug: false
        }, null, null);

        this.Modules = {
            commands: new Map(),
            aliases: new Map(),
            eventHandlers: new Map(),
            channel: null,
        };
        this.utils = new Util(this);

        console.log("Code    : Starting register process of event handlers");
        this.utils.loadEventHandlers().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Code    : Register process of event handlers complete");
        });
    }

    /**
     * Validates that the provided config is valid cus yes
     * @function
     * @param {Object} config 
     */
    validate(config) {
        if (typeof config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!config.token) throw new Error("You must pass the token for the client");

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");

        if (config.debug) {
            console.warn("Code    : Debug mode enabled...");
            this.debug = config.debug;
        }
        this.debug ?? false;

        this.config = config;
    }

    /**
     * Start function
     * @async
     * @function
     */
    async start() {
        await this.RainCache.initialize();
        this.Cache = this.RainCache.cache; // To try the other position
        console.log("Code    : Starting register process of command handlers");
        await this.utils.loadCommands().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Code    : Register process of command handlers complete");
        });
        this.AmqpClient.initQueueAndConsume(this.config.amqp.queueCacheCode, undefined, async (event, ch) => {

            const ParsedEvent = JSON.parse(event.content.toString());
            // I believe this code is more efficient simply due to the fact that it should use less ram, doesn't have to go through Events and messages can be requeued
            const Dispatch = async (event) => {
                this.debug.events.type ? console.log(`Code    : Event received, type ${event.t}`) : undefined;
                this.debug.events.data && this.debug.events.data[event.t] ? console.log("data", event.d) : undefined;
                if (event.t && this.Modules.eventHandlers.get((event.t).toLowerCase())) {
                    (this.Modules.eventHandlers.get((event.t).toLowerCase())).run(event, event.d).catch(console.error);
                }
            };

            this.debug.opCodes ? console.warn(`Code    : Received op code ${ParsedEvent.op}`) : undefined;
            Dispatch(ParsedEvent).catch(err => {
                console.error(err);
                ch.nack(event, false, true);
                return;
            });
            ch.ack(event);
        }).then(async ch => {
            this.Modules.channel = ch.assertQueue(this.config.amqp.queueCodeGateway);
        });
    }
};