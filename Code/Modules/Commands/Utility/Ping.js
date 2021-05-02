const Command = require("../../../Structures/Command.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["Pong"],
            usage: `**Name**
        Ping - display ping time between message create and response message create

**Synposis**
        Ping [Options]

**Description**
        --multi-test    Run multiple ping tests (Approx. 3)
            `
        });
    }

    async run(message, args) {
        if (args.some(arg => arg === "--multi-test")) {
            this.createPing(message);
            this.createPing(message);
            this.createPing(message);
            super.report(message.author.username, "multiple ping messages");
        } else {
            const time = await this.createPing(message);
            super.report(message.author.username, `Pong! Round Trip message latency is ${time}ms`);
        }
        //Yea yea am aware abt callback chaos
    }

    async createPing(message) {
        const msg = await this.client.channel.createMessage(message.channel_id, "Measuring...");
        await this.client.channel.editMessage(msg.channel_id, msg.id, `Pong! Round Trip message latency is ${Date.parse(msg.timestamp) - Date.parse(message.timestamp)}ms`);
        return Date.parse(msg.timestamp) - Date.parse(message.timestamp);
    }
};