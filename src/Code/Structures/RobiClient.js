const SnowTransfer = require("snowtransfer");
const RainCache = require("raincache");
const Util = require("./Util.js");

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
            "ownerBot": Config.ownerbot,
            "token": Config.token,
            "selfID": "",
            /*"prefix": Config.prefix*/
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

        /*const Database = require("../../Database/Database.js");
        this.Database = new Database(Config);*/

        this.Modules = {
            commands: new Map(),
            aliases: new Map(),
            eventHandlers: new Map(),
            modules: new Map(),
            structures: new Map(),
            channel: null,
        };
        this.Modules.structures.set("MessageEmbed", (require("./MessageEmbed.js")));
        this.Modules.structures.set("Command", new (require("./Command.js"))(this));
        this.Modules.structures.set("EventHandler", new (require("./EventHandler.js"))(this));
        this.Modules.structures.get("EventHandler").register("interaction_create", async (Event, Data) => {
            const command = this.Modules.commands.get(Data.data.name);
            if (!command) throw new Error("Received slash for command for non existent/registered command!");
            this.debug.command ? console.log(`Command: ${Data.data.name}`) : undefined;
            command(Data).catch(err => {
                console.error(err);
                this.client.channel.createMessage(Data.channel_id, `<@${Data.member ? Data.member.user.id : Data.user.id}> Error when running command, ${err}`);
            });
        });

        this.Utils = new Util(this);

        console.log("Code    : Starting register process of event handlers");
    }

    /**
     * Validates that the provided config is valid cus yes
     * @function
     * @param {Object} Config 
     */
    validate(Config) {
        if (typeof Config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!Config.token) throw new Error("You must pass the token for the client");

        /*if (!Config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof Config.prefix !== "string") throw new TypeError("Prefix should be a type of String");*/

        if (Config.debug) {
            console.warn("Code    : Debug mode enabled...");
            this.debug = Config.debug;
        }
        this.debug ?? false;

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
        /*await this.Database.start();
        await this.Database.loadTypes();*/
        console.log("Code    : Starting register process of modules");
        await this.Utils.loadModules().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Code    : Register process of Modules complete");
        }).catch(err => console.error("Error while loading modules\n", err));
        this.AmqpClient.initQueueAndConsume(this.Config.amqp.queueCacheCode, undefined, async (event, ch) => {
            const ParsedEvent = JSON.parse(event.content.toString());
            const Dispatch = async (event) => {
                this.debug.events.type ? console.log(`Code    : Event received, type ${event.t}`) : undefined;
                this.debug.events.data && this.debug.events.data[event.t] ? console.log("data", event.d) : undefined;
                if (event.t && this.Modules.eventHandlers.get((event.t).toLowerCase())) {
                    await (this.Modules.eventHandlers.get((event.t).toLowerCase()))(event, event.d).catch(err => console.error("Error while handling event\n", err));
                }
            };

            this.debug.opCodes ? console.warn(`Code    : Received op code ${ParsedEvent.op}`) : undefined;
            Dispatch(ParsedEvent).catch(err => {
                console.error("Error while dispatching event\n", err);
                ch.nack(event, false, true);
                return;
            }).then(() => {
                ch.ack(event);
            });
        }).then(async ch => {
            this.Modules.channel = ch.assertQueue(this.Config.amqp.queueCodeGateway,  { durable: false, autoDelete: true });
        });
    }
};