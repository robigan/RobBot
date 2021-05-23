module.exports = class Command {
    /**
     * Base class for commands
     * @constructor
     * @param {import("./RobiClient")} client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Register a new command
     * @param {string} name
     * @param {function plugin(Message, Args) {}} command
     * @param {Object} options 
     */
    async register(name, command, options = {"aliases": [], "description": "No description provided", "category": "Miscellaneous"}) {
        if (this.client.Modules.commands.get(name.toLowerCase())) throw new SyntaxError(`Command ${name} has already been registered`);
        if (options.aliases.length) {
            for (const alias of options.aliases) {
                if (this.client.Modules.aliases.get(alias.toLowerCase()) || this.client.Modules.commands.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined`);
                this.client.Modules.aliases.set(alias.toLowerCase(), name);
            }
        }
        await this.client.interaction.createApplicationCommand("330957377572569089", JSON.stringify({
            "name": options.name,
            "description": options.description,
        }));
        this.client.Modules.commands.set(name.toLowerCase(), command);
    }

    async unregister(name) {
        this.client.Modules.commands.delete(name);
    }
};