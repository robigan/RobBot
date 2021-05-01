const Command = require("../../../Structures/Command.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["Stop"]
        });
        this.config = this.client.config;
    }

    async run(message) {
        if (this.config.ownerBot.id && message.author.id === this.config.ownerBot.id) {
            await this.client.channel.createMessage(message.channel_id, "Shutting down now!");
            console.log(`Process killed by ${message.author.username}`);
            process.exit(); // Have to update to send process.exit() event to the other systems...
        } else {
            this.client.channel.createMessage(message.channel_id, "An error was encountered");
        }
        super.report(message.author.username, "error?");
    }
};