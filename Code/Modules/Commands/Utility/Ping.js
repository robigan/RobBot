const Command = require("../../../Structures/Command.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["Pong"]
        });
    }

    async run(message) {
        const msg = await this.client.channel.createMessage(message.channel_id, "Measuring...");
        this.client.channel.editMessage(msg.channel_id, msg.id, `Pong! Round Trip message latency is ${Date.parse(msg.timestamp) - Date.parse(message.timestamp)}ms`).then(async m => {
            super.report(message.author.username, m.content);
        });
        //Yea yea am aware abt callback chaos
    }
};