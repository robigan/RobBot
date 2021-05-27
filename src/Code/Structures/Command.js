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
     * @param {import("@amanda/discordtypings").Snowflake} id
     * @param {function(import("@amanda/discordtypings").InteractionData)} command
     * @param {{"description": string, "category": string, "man": string, "type": ("global" | "guild"), "guild_id": string, "options": import("@amanda/discordtypings").ApplicationCommandOption, "default_permission": boolean, "name": string}} [options]
     */
    async register(id, command, options) {
        options = Object.assign({ "description": "No description provided", "category": "Miscellaneous", "man": "No man page provided", "type": "global", "options": [], "default_permission": true }, options);
        if (options.type && (options.type === "guild") && options.guild_id) {
            const AppCommand = await this.client.interaction.createGuildApplicationCommand(this.client.Identify.appID, options.guild_id, {
                "name": options.name,
                "description": options.description,
                "options": options.options,
                "default_permission": options.default_permission
            }).catch(err => console.error("Error while registering guild application command\n", err));
            if (AppCommand) {
                this.client.Modules.commands.set(AppCommand.id, { "options": options, "command": command });
                return AppCommand;
            } else return false;
        } else if (options.type === "global") {
            if (this.client.Modules.commands.get(id)) throw new SyntaxError(`Command ${options.name}(${id}) has already been registered`);
            if ((!id) || id === "" || !(id.length === 18)) throw new SyntaxError(`Command ${options.name} was being registered but didn't provide an id`);
            const AppCommand = await this.client.interaction.getApplicationCommand(this.client.Identify.appID, id);
            if (!(AppCommand.name === options.name)) throw new Error(`Provided name for global command didn't match the one returned by discord\nProvided command: ${options.name} | Returned command: ${AppCommand.name}`);
            this.client.Modules.commands.set(id, { "options": options, "command": command });
            return AppCommand;
        }
    }

    /**
     * Unregister a command
     * @param {import("@amanda/discordtypings").Snowflake} id 
     */
    async unregister(id) {
        const Command = this.client.Modules.commands.get(id);
        if ((Command.options.type === "guild") && Command.options.guild_id) {
            await this.client.interaction.deleteGuildApplicationCommand(this.client.Identify.appID, Command.options.guild_id, id)
                .catch(err => console.error("Error while deleting guild application command\n", err))
                .then(() => {
                    this.client.Modules.commands.delete(id);
                    return true;
                });
        } else if (Command.options.type === "global") {
            await this.client.interaction.deleteApplicationCommand(this.client.Identify.appID, id)
                .catch(err => console.error("Error while deleting application command\n", err))
                .then(() => {
                    this.client.Modules.commands.delete(id);
                    return true;
                });
        } else {
            return false;
        }
    }
};