const Path = require("path");
const Command = require("./Command.js");
const EventHandler = require("./EventHandler.js");
const LocRes = new (require("../../../LocationResolver.js"));

module.exports = class Util {
    /**
     * Constructor for utils
     * @constructor
     * @param {import("./RobiClient")} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Checks if input is a class
     * @param {Function} input
     * @returns {boolean}
     */
    isClass(input) {
        return typeof input === "function" && typeof input.prototype === "object" &&
        input.toString().substring(0, 5) === "class";
    }

    /**
     * Load Commands
     * @async
     * @function
     */
    async loadCommands() {
        console.warn("Code    : Remember, only load commands you trust");
        LocRes.glob(LocRes.redirect("/src/Code/Modules/Commands/**/*.js")).then((commands) => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = Path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) console.error(`Command ${name} doesn't export a class`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands`);
                if (this.client.Modules.commands.get(command.name)) throw new SyntaxError(`Command ${command.name} has already been defined, please rename it to something else`);
                this.client.Modules.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        if (this.client.Modules.aliases.get(alias.toLowerCase()) || this.client.Modules.commands.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined, please rename ${command.name} to something else`);
                        this.client.Modules.aliases.set(alias.toLowerCase(), command.name);
                    }
                }
            }
        });
    }

    /**
     * Load Event Handlers
     * @async
     * @function
     */
    async loadEventHandlers() {
        console.warn("Code    : Remember, only load EventHandlers you trust");
        LocRes.glob(LocRes.redirect("/src/Code/Modules/EventHandlers/**/*.js")).then((eventHandlers) => {
            for (const eventFile of eventHandlers) {
                delete require.cache[eventFile];
                const { name } = Path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) console.error(`Event ${name} doesn't export a class`);
                const event = new File(this.client, name.toLowerCase());
                if (!(event instanceof EventHandler)) throw new TypeError(`Event ${name} doesn't belong in EventHandlers`);
                if (this.client.Modules.eventHandlers.get(event.name)) throw new SyntaxError(`Event ${event.name} has already been defined, please rename it to something else`);
                this.client.Modules.eventHandlers.set(event.name, event);
            }
        });
    }

    async makeGatewayRequest(content) {
        this.client.Modules.channel.sendToQueue(this.client.config.amqp.queueCodeGateway, content);
    }

    /**
     * Format an array to be cut off after maxLen, useful for formatting roles
     * @function
     * @async
     * @param {import("@amanda/discordtypings").RoleData[]} arr 
     * @param {number} maxLen 
     * @returns {import("@amanda/discordtypings").RoleData[]}
     */
    async formatRoles(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        } else if(arr.length < maxLen) {
            arr.join(", ");
        }
        return arr;
    }
};