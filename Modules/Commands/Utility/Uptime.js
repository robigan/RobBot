const Command = require('../../../Structures/Command.js');
const ms = require('ms');

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        message.channel.send(`Uptime is ${ms(this.client.uptime, { long: true })} and process uptime is ${process.uptime()}s`).then(m => {
            super.report(message.author.username, m.content);
        });
    }
}