module.exports = class InteractionPipeline {
    /**
     * Base class for commands
     * @constructor
     * @param {import("./RobiClient")} client
     */
    constructor(client) {
        this.client = client;
        this.client.Struct.get("EventHandler").register("interaction_create", async (/** @type {import("@amanda/discordtypings").InteractionData} */Data, /** @type {import("cloudstorm/dist/Types").IWSMessage} */Event) => {
            const command = this.client.Modules.commands.get(Data.data.id);
            if (!command) throw new Error("Received slash command for non existent/registered command");
            this.client.Debug.command ? console.log(`Author  : ${Data.member ? Data.member.user.username : Data.user.username}\nCommand : ${command.options.name}`) : undefined;
            this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 5 });
            command.command(Data, Event).catch(err => {
                console.error("Error while running command\n", err);
                this.sendErrorDetails(Data, err, "Command failure");
            });
        });
    }

    /**
     * Register a new command
     * @param {import("@amanda/discordtypings").Snowflake} id
     * @param {function(import("@amanda/discordtypings").InteractionData)} command
     * @param {{"description": ?string, "category": ?string, "man": string, "type": ?("global" | "guild"), "guild_id": ?string, "options": ?import("@amanda/discordtypings").ApplicationCommandOption, "default_permission": ?boolean, "name": string}} [options]
     */
    async registerCommand(id, command, options) {
        options = Object.assign({ "description": "No description provided", "category": "Miscellaneous", "man": "No man page provided", "type": "global", "options": [], "default_permission": true }, options);
        if (options.type && (options.type === "guild") && options.guild_id) {
            if (this.client.Modules.commands.get(id)) throw new SyntaxError(`Command ${options.name}(${id}) has already been registered`);
            const TestAppCommand = await this.client.interaction.getApplicationCommand(this.client.Identify.appID, id).catch(async (err) => console.error("Error when getting an Application Command", err));
            if (TestAppCommand) {
                if (!(TestAppCommand.name === options.name)) throw new Error(`Provided name for guild command didn't match the one returned by discord\nProvided command: ${options.name} | Returned command: ${TestAppCommand.name}`);
                this.client.Modules.commands.set(id, { "options": options, "command": command });
                return TestAppCommand;
            } else {
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
            }
        } else if (options.type === "global") {
            if (this.client.Modules.commands.get(id)) throw new SyntaxError(`Command ${options.name}(${id}) has already been registered`);
            if ((!id) || id === "" || !(id.length === 18)) throw new SyntaxError(`Command ${options.name} was being registered but didn't provide an id`);
            const AppCommand = await this.client.interaction.getApplicationCommand(this.client.Identify.appID, id).catch(async (err) => console.error("A command was being registered for a non existent command", err));
            if (!(AppCommand.name === options.name)) throw new Error(`Provided name for global command didn't match the one returned by discord\nProvided command: ${options.name} | Returned command: ${AppCommand.name}`);
            this.client.Modules.commands.set(id, { "options": options, "command": command });
            return AppCommand;
        }
    }

    /**
     * Unregister a command
     * @param {import("@amanda/discordtypings").Snowflake} id 
     */
    async unregisterCommand(id) {
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

    /**
     * Makes easier sending an error with details back to the end user
     * @param {import("@amanda/discordtypings").InteractionData} Data 
     * @param {(Error|string)} Err 
     * @param {string} Type 
     */
    async sendErrorDetails(Data, Err, Type) {
        /*const CreateErrorEmbed = async (ErrorFull, ErrorType) => {
            return new (this.client.Struct.get("MessageEmbed"))()
                .setTitle("Error while processing the slash interaction")
                .addField("Error Type", ErrorType)
                .addField("Error Details", ErrorFull.toString())
                .setTimestamp()
                .setColor("RED");
        };

        const ErrorEmbed = CreateErrorEmbed(Err, Type);*/

        await this.editResponse(Data, {
            "embeds": [
                new (this.client.Struct.get("MessageEmbed"))()
                    .setTitle("Error while processing the slash interaction")
                    .addField("Error Type", Type)
                    .addField("Error Details", Err.toString())
                    .setTimestamp()
                    .setColor("RED")
            ],
            "flags": 64
        }).catch(async err => {
            console.error("CRITICAL ERROR, FAILURE IN ERROR HANDLING, REPORT THIS IMMEDIATELY\nCRITICAL ERROR, FAILURE IN ERROR HANDLING, REPORT THIS IMMEDIATELY\nCRITICAL ERROR, FAILURE IN ERROR HANDLING, REPORT THIS IMMEDIATELY\nNo fallback system implemented\nError:", err);
        });
    }

    /**
     * editResponse, handles the createInteractionResponse method, and integrates it with the Interaction Pipeline
     * @param {import("@amanda/discordtypings").InteractionData} Data 
     * @param {import("@amanda/discordtypings").InteractionApplicationCommandCallbackData} CallbackStructure 
     */
    async editResponse(Data, CallbackStructure) {
        await this.client.interaction.editOriginalInteractionResponse(this.client.Identify.appID, Data.token, CallbackStructure).catch(Err => this.sendErrorDetails(Data, Err, "editOriginalInteractionResponse"));
    }
};