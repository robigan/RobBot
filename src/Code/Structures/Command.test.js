/**
 * Base class for Commands
 * @typedef {Object} Message
 * @property {}
 */

module.exports = class Command {
    /**
     * Base class for commands
     * @constructor
     * @param {import("./RobiClient")} client 
     */
    constructor(client) {
        this.client = client;
    }

    async register(plugin, options) {
        if (this.client.Modules.commands.get(options.name.toLowerCase())) throw new SyntaxError(`Command ${options.name} has already been registered`);
        if (options.aliases.length) {
            for (const alias of options.aliases) {
                if (this.client.Modules.aliases.get(alias.toLowerCase()) || this.client.Modules.commands.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined`);
                this.client.Modules.aliases.set(alias.toLowerCase(), options.name);
            }
        }
        this.client.Modules.commands.set(options.name.toLowerCase(), plugin);
    }

};