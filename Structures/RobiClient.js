const { Client, Collection } = require("discord.js");
//const log = require('log');
const Util = require("./Util.js");

module.exports = class RobiClient extends Client {
    constructor(config = {}) {
        super({
            messageCacheMaxSize: 200,
            messageCacheLifetime: 3600,
            messageSweepInterval: 60
        });

        this.validate(config);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.eventHandlers = new Collection();
        this.utils = new Util(this);

        console.log("Starting register process of event handlers");
        this.utils.loadEventHandlers().catch((err) => {
            console.error(err);
        }).finally(() => {
            console.log("Register process of event handlers complete");
        });

        this.once("ready", async () => {
            console.log(`Logged is as ${this.user.tag}`);
        });
    }

    validate(config) {
        if (typeof config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!config.token) throw new Error("You must pass the token for the client");
        this.token = config.token;

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");
        this.prefix = config.prefix;

        this.config = config;
    }

    async start(token = this.token) {
        await this.utils.loadCommands().catch((err) => {
            console.error(err);
        });
        super.login(token);
    }
};