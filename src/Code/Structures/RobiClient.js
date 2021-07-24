const SnowTransfer = require("snowtransfer");
const RainCache = require("raincache");

/**
 * RobiClient class
 * @extends {SnowTransfer}
 */
module.exports = class RobiClient extends SnowTransfer {
    /**
     * Initiate the RobiClient for RobBot
     * @constructor
     * @param {Object} Config 
     */
    constructor(Config = {}) {
        super(Config.token, Config.SnowTransfer);
        this.validate(Config);

        /**
         * @namespace
         * @property {string} ownerBot
         * @property {string} appID
         * @property {string} token
         * @property {string} selfID
         */
        this.Identify = {
            "ownerBot": Config.Bot.owner,
            "appID": Config.Bot.appID,
            "token": Config.token,
            "selfID": ""
        };

        const RainCacheConfig = require("../../../Configs/CacheClient.json");
        RainCacheConfig.Engines.forEach(Unit => {
            if (!(Unit.type === "redis")) return;
            RainCacheConfig.RainCache.storage[Unit.engineType] = new RainCache.Engines.RedisStorageEngine(Unit.options);
        });

        this.Modules = {
            commands: new Map(),
            eventHandlers: new Map(),
            /** @type {import("./JSDocModules.js").mMap} */
            modules: new Map(),
        };

        /** @type {import("./JSDocStruct.js")} */
        this.Struct = new Map();
        this.Struct.set("MessageEmbed", require("./MessageEmbed.js"));
        this.Struct.set("EventHandler", new (require("./EventHandler.js"))(this));
        this.Struct.set("Utils", new (require("./Util.js"))(this));
        this.Struct.set("Database", new (require("../../Database/Database.js"))(Config));
        this.Struct.set("AmqpClient", global.robbotAmqpClient);
        this.Struct.set("RainCache", new RainCache({
            storage: {
                default: new RainCache.Engines.RedisStorageEngine({
                    redisOptions: {
                        host: "localhost"
                    }
                })
            }, debug: false
        }, null, null));
        this.Struct.set("IntPi", new (require("./InteractionPipeline.js"))(this));
        this.Struct.set("LocRes", global.robbotLocRes);

        /** @type {import("../../Database/Database.js")} */
        this.Database = this.Struct.get("Database");
        /** @type {RainCache} */
        this.RainCache = this.Struct.get("RainCache");
    }

    /**
     * Validates that the provided config is valid cus yes
     * @function
     * @param {Object} Config 
     */
    validate(Config) {
        if (typeof Config !== "object") throw new TypeError("Config and should be a type of Object");
        if (!Config.token) throw new Error("You must pass the token for the client");

        this.Debug = Config.debug ?? false;

        this.Config = Config;
    }

    /**
     * Start function
     * @async
     * @function
     */
    async start() {
        await this.RainCache.initialize();
        this.Cache = this.RainCache.cache;

        this.Identify.selfID = (await this.Cache.user.get("self")).id;

        await this.Database.start();
        await this.Database.loadTypes();

        this.Debug.moduleRegister ? console.log("Code    : Starting register process of modules") : undefined;
        await this.Struct.get("Utils").loadModules().catch((err) => {
            console.error(err);
        }).finally(() => {
            this.Debug.moduleRegister ? console.log("Code    : Register process of Modules complete") : undefined;
        }).catch(err => console.error("Error while loading modules\n", err));

        this.Struct.get("AmqpClient").initQueueAndConsume(this.Config.amqp.queueCacheCode, undefined, async (event, ch) => {
            const ParsedEvent = JSON.parse(event.content.toString());

            /** @param {import("cloudstorm/dist/Types").IWSMessage} event */
            const Dispatch = async (event) => {
                this.Debug.events.type ? console.log(`Code    : Event received, type ${event.t}`) : undefined;
                this.Debug.events.data && this.Debug.events.data[event.t] ? console.log("data", event.d) : undefined;
                if (event.t && this.Modules.eventHandlers.get((event.t).toLowerCase())) {
                    await (this.Modules.eventHandlers.get((event.t).toLowerCase()))(event.d, event).catch(err => {
                        console.error("Error while handling event\n", err);
                        event.t === "interaction_create" ? this.Struct.get("IntPi").sendErrorDetails(event.d, err, "Handler failure") : undefined;
                    });
                }
            };

            this.Debug.opCodes ? console.warn(`Code    : Received op code ${ParsedEvent.op}`) : undefined;
            Dispatch(ParsedEvent).catch(err => {
                console.error("Error while dispatching event\n", err);
                ch.nack(event, false, true);
                return;
            }).then(() => {
                ch.ack(event);
            });
        });
    }
};