const SnowTransfer = require("snowtransfer");
const CloudStorm = require("cloudstorm");
const Util = require("./Util.js");

module.exports = class RobiClient extends SnowTransfer {
    constructor(config = {}) {
        super(config.token, config.SnowTransfer);

        this.validate(config);

        this.commands = new Map();
        this.aliases = new Map();
        this.eventHandlers = new Map();
        this.utils = new Util(this);

        console.log("Starting register process of event handlers");
        this.utils.loadEventHandlers().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Register process of event handlers complete");
        });

        this.CloudStorm.on("dispatch", async (event) => {
            this.debug.type ? console.log(`Event received, type ${event.t}`) : undefined;
            this.debug.data && this.debug.data[event.t] ? console.log("data", event.d) : undefined;
            if (event.t && this.eventHandlers.get((event.t).toLowerCase())) {
                (this.eventHandlers.get((event.t).toLowerCase())).run(event, event.d).catch(console.error);
            }
        });

        this.CloudStorm.once("ready", async () => {
            console.log("Logged in!");
        });
    }

    validate(config) {
        if (typeof config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!config.token) throw new Error("You must pass the token for the client");
        this.token = config.token;

        if (!config.CloudStorm) throw new Error("You must pass a CloudStorm configuration");
        if (typeof config.CloudStorm !== "object") throw new Error("CloudStorm config must be an object");
        this.CloudStorm = new CloudStorm(config.token, config.CloudStorm);

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");
        this.prefix = config.prefix;

        if (config.debug) { 
            console.warn("Debug mode enabled...");
            this.debug = config.debug;
        }
        this.debug ?? false;

        this.config = config;
    }

    async start() {
        await this.utils.loadCommands().catch((err) => {
            console.error(err);
        });
        await this.CloudStorm.connect();
    }
};