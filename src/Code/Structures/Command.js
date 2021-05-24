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
     * @param {function(Message, Args)} command
     * @param {Object} options 
     */
    async register(name, command, options) {
        options = Object.assign({ "description": "No description provided", "category": "Miscellaneous", "man": "No man page provided", "type": "guild", "guild_id": "538380022227009562" }, options);
        if (this.client.Modules.commands.get(name.toLowerCase())) throw new SyntaxError(`Command ${name} has already been registered`);
        if (options.type && (options.type === "guild") && options.guild_id) {
            this.client.interaction.createGuildApplicationCommand(this.client.Config.Bot.appID, options.guild_id, {
                "name": name,
                "description": options.description,
            })
                .catch(err => console.error("Error while registering guild application command\n", err))
                .then(() => this.client.Modules.commands.set(name.toLowerCase(), { "options": options, "command": command }));
        } else if (options.type === "global") {
            this.client.interaction.createApplicationCommand(this.client.Config.Bot.appID, {
                "name": name,
                "description": options.description,
            })
                .catch(err => console.error("Error while registering application command\n", err))
                .then(() => this.client.Modules.commands.set(name.toLowerCase(), { "options": options, "command": command }));
        }
        /*if (options.aliases && options.aliases.length) {
            for (const alias of options.aliases) {
                if (this.client.Modules.aliases.get(alias.toLowerCase()) || this.client.Modules.commands.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined`);
                this.client.Modules.aliases.set(alias.toLowerCase(), name);
            }
        }*/
    }

    async unregister(name) {
        const Command = this.client.Modules.commands.get(name);
        if ((Command.options.type === "guild") && Command.options.guild_id) {
            this.client.interaction.deleteGuildApplicationCommand(this.client.Config.Bot.appID, Command.options.guild_id, name)
                .catch(err => console.error("Error while deleting guild application command\n", err))
                .then(() => this.client.Modules.commands.delete(name));
        } else if (Command.options.type === "global") {
            this.client.interaction.deleteApplicationCommand(this.client.Config.Bot.appID, name)
                .catch(err => console.error("Error while deleting application command\n", err))
                .then(() => this.client.Modules.commands.delete(name));
        }
        this.client.Modules.commands.delete(name);
    }
};