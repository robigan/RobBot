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
    async register(name, command, options = {"aliases": [], "description": "No description provided", "category": "Miscellaneous", "man": "No man page provided", "type": "guild", "guild_id": "538380022227009562"}) {
        if (this.client.Modules.commands.get(name.toLowerCase())) throw new SyntaxError(`Command ${name} has already been registered`);
        if (options.aliases && options.aliases.length) {
            for (const alias of options.aliases) {
                if (this.client.Modules.aliases.get(alias.toLowerCase()) || this.client.Modules.commands.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined`);
                this.client.Modules.aliases.set(alias.toLowerCase(), name);
            }
        }
        options.type && (options.type === "guild") && options.guild_id ? await this.client.interaction.createGuildApplicationCommand(this.client.config.Bot.appID, options.guild_id, {
            "name": name,
            "description": options.description,
        }).catch(console.error) : await this.client.interaction.createApplicationCommand(this.client.config.Bot.appID, {
            "name": name,
            "description": options.description,
        }).catch(console.error);
        this.client.Modules.commands.set(name.toLowerCase(), {"options": options, "command": command});
    }

    async unregister(name) {
        //await this.client.interaction.deleteApplicationCommand();
        this.client.Modules.commands.delete(name);
    }
};