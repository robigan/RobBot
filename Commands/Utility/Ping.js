const Command = require('../../Structures/Command.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['Pong']
        });
    }

    async run(message) {
        message.channel.send("Measuring...").then(msg => {
            msg.edit(`Pong! Round Trip message latency is ${msg.createdTimestamp - message.createdTimestamp}ms, API latency is ${this.client.ws.ping}ms`).then(m => {
                super.report(message.author.username, m.content);
            });
        });
        //Yea yea am aware abt callback chaos
    }
}