const SnowTransfer = require("snowtransfer");
const Util = require("./Util.js");

module.exports = class RobiClient extends SnowTransfer {
    /**
     * Initiate the RobiClient for RobBot
     * @constructor
     * @param {object} config 
     * @param {import("../../amqp/AmqpClient")} AmqpClient 
     */
    constructor(config = {}, AmqpClient) {
        super(config.token, config.SnowTransfer);

        this.validate(config);
        this.AmqpClient = AmqpClient;
        this.Events = new (require("events").EventEmitter)();

        this.commands = new Map();
        this.aliases = new Map();
        this.eventHandlers = new Map();
        this.utils = new Util(this);

        console.log("Code    : Starting register process of event handlers");
        this.utils.loadEventHandlers().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Code    : Register process of event handlers complete");
        });

        this.Events.on("dispatch", async (event) => {
            this.debug.events.type ? console.log(`Code    : Event received, type ${event.t}`) : undefined;
            this.debug.events.data && this.debug.events.data[event.t] ? console.log("data", event.d) : undefined;
            if (event.t && this.eventHandlers.get((event.t).toLowerCase())) {
                (this.eventHandlers.get((event.t).toLowerCase())).run(event, event.d).catch(console.error);
            }
        });
    }

    /**
     * Validates that the provided config is valid cus yes
     * @function
     * @param {object} config 
     */
    validate(config) {
        if (typeof config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!config.token) throw new Error("You must pass the token for the client");
        this.token = config.token;

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");
        this.prefix = config.prefix;

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
        console.log("Code    : Starting register process of command handlers");
        await this.utils.loadCommands().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Code    : Register process of command handlers complete");
        });
        this.AmqpClient.initQueueAndConsume(this.config.amqp.queueCacheCode, undefined, async (event, ch) => {
            const ParsedEvent = JSON.parse(event.content.toString());
            if (ParsedEvent.op === 0) this.Events.emit("dispatch", ParsedEvent);
            else if (ParsedEvent.op === 4) this.Events.emit("voiceStateUpdate", ParsedEvent);
            else this.Events.emit("event", ParsedEvent);
            ch.ack(event);
        });
    }
};