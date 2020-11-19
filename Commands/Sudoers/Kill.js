const Command = require('../../Structures/Command.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['Stop']
        });
        this.config = this.client.config;
    }

    async run(message) {
        if (this.config.ownerBot.id && message.author.id === this.config.ownerBot.id) {
            message.channel.send(`Shutting down now!`).then(() => {
                console.log(`Process killed by ${message.author.username}`);
                process.exit();
            });
        } else {
            message.channel.send("An error was encountered");
        }
        super.report(message.author.username, `error?`);
    }
}