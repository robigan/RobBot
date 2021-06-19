const SnowTransfer = require("snowtransfer");
const RainCache = require("raincache");
//const Util = require("./Util.js");

module.exports = class RobiClient extends SnowTransfer {
    /**
     * Initiate the RobiClient for RobBot
     * @constructor
     * @param {Object} Config 
     * @param {import("../../amqp/AmqpClient")} AmqpClient 
     */
    constructor(Config = {}, AmqpClient) {
        super(Config.token, Config.SnowTransfer);
        this.validate(Config);

        this.AmqpClient = AmqpClient;

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
        this.RainCache = new RainCache({
            storage: {
                default: new RainCache.Engines.RedisStorageEngine({
                    redisOptions: {
                        host: "localhost"
                    }
                })
            }, debug: false
        }, null, null);

        const Database = require("../../Database/Database.js");
        this.Database = new Database(Config);

        this.Modules = {
            commands: new Map(),
            eventHandlers: new Map(),
            modules: new Map(),
            /** @type {Map([["MessageEmbed", require("./MessageEmbed.js")], ["Command", new (require("./Command.js"))(this)], ["EventHandler", new (require("./EventHandler.js"))(this)], ["Utils", new (require("./Util.js"))(this)]])} */
            structures: new Map([["MessageEmbed", require("./MessageEmbed.js")], ["Command", new (require("./Command.js"))(this)], ["EventHandler", new (require("./EventHandler.js"))(this)], ["Utils", new (require("./Util.js"))(this)]]),
        };
        this.Modules.structures.get("EventHandler").register("interaction_create", async (Data, Event) => {
            const command = this.Modules.commands.get(Data.data.id);
            if (!command) throw new Error("Received slash command for non existent/registered command");
            this.Debug.command ? console.log(`Author  : ${Data.member ? Data.member.user.username : Data.user.username}\nCommand : ${command.options.name}`) : undefined;
            command.command(Data, Event).catch(err => {
                console.error("Error while running command\n", err);
                this.Modules.structures.get("Utils").sendErrorDetails(Data, err, "Command failure");
            });
        });
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
        await this.Database.start();
        await this.Database.loadTypes();
        this.Debug.moduleRegister ? console.log("Code    : Starting register process of modules") : undefined;
        await this.Modules.structures.get("Utils").loadModules().catch((err) => {
            console.error(err);
        }).finally(() => {
            this.Debug.moduleRegister ? console.log("Code    : Register process of Modules complete") : undefined;
        }).catch(err => console.error("Error while loading modules\n", err));
        this.Identify.selfID = (await this.Cache.user.get("self")).id;
        this.AmqpClient.initQueueAndConsume(this.Config.amqp.queueCacheCode, undefined, async (event, ch) => {
            const ParsedEvent = JSON.parse(event.content.toString());
            const Dispatch = async (event) => {
                this.Debug.events.type ? console.log(`Code    : Event received, type ${event.t}`) : undefined;
                this.Debug.events.data && this.Debug.events.data[event.t] ? console.log("data", event.d) : undefined;
                if (event.t && this.Modules.eventHandlers.get((event.t).toLowerCase())) {
                    await (this.Modules.eventHandlers.get((event.t).toLowerCase()))(event.d, event).catch(err => {
                        console.error("Error while handling event\n", err);
                        this.Modules.structures.get("Utils").sendErrorDetails(event.d, err, "Handler failure");
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