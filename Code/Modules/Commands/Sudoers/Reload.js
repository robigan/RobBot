const Command = require("../../../Structures/Command.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["HotReload"]
        });
        this.config = this.client.config;
    }

    async run(message) {
        if (this.config.ownerBot.id && message.author.id === this.config.ownerBot.id) {
            this.client.Modules.commands.forEach((value, key) => {
                this.client.Modules.commands.delete(key);
            });
            this.client.Modules.aliases.forEach((value, key) => {
                this.client.Modules.aliases.delete(key);
            });
            this.client.Modules.eventHandlers.forEach((value, key) => {
                this.client.Modules.eventHandlers.delete(key);
            });
            this.client.utils.loadCommands();
            this.client.utils.loadEventHandlers();
            this.client.channel.createMessage(message.channel_id, "Reloaded commands and event handlers!");
            super.report(message.author.username, "Reloaded commands and event handlers!");
        } else {
            this.client.channel.createMessage(message.channel_id, "An error was encountered");
            super.report(message.author.username, "Error");
        }
    }
};