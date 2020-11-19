const Path = require("path");
const Command = require("./Command.js");
const EventHandler = require("./EventHandler.js");
const LocRes = new (require("./LocationResolver.js"));

module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    isClass(input) {
        return typeof input === "function" && typeof input.prototype === "object" &&
        input.toString().substring(0, 5) === "class";
    }

    async loadCommands() {
        return LocRes.glob(LocRes.redirect("/Modules/Commands/**/*.js")).then((commands) => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = Path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) console.error(`Command ${name} doesn't export a class`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands`);
                if (this.client.commands.get(command.name)) throw new SyntaxError(`Command ${command.name} has already been defined, please rename it to something else`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        if (this.client.aliases.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined, please rename ${command.name} to something else`);
                        this.client.aliases.set(alias.toLowerCase(), command.name);
                    }
                }
            }
        });
    }

    async loadEventHandlers() {
        return LocRes.glob(LocRes.redirect("/Modules/EventHandlers/**/*.js")).then((eventHandlers) => {
            for (const eventFile of eventHandlers) {
                delete require.cache[eventFile];
                const { name } = Path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) console.error(`Event ${name} doesn't export a class`);
                const event = new File(this.client, name.toLowerCase());
                if (!(event instanceof EventHandler)) throw new TypeError(`Event ${name} doesn't belong in EventHandlers`);
                if (this.client.eventHandlers.get(event.name)) throw new SyntaxError(`Event ${event.name} has already been defined, please rename it to something else`);
                this.client.eventHandlers.set(event.name, event);
            }
        });
    }

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