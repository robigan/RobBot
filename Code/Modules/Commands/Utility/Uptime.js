const Command = require("../../../Structures/Command.js");
const ms = require("ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        this.client.channel.createMessage(message.channel_id, `Process Uptime is ${ms(process.uptime(), { long: true })}`).then(async msg => super.report(message.author.username, msg.content));
    }
};