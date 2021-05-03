const Command = require("../../../Structures/Command.js");
const ms = require("ms");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
    }

    /**
     * Run uptime command
     * @async
     * @function
     * @param {import("@amanda/discordtypings").MessageData} message
     */
    async run(message) {
        this.client.channel.createMessage(message.channel_id, `Process Uptime is ${ms((process.uptime() * 1000), { long: true })}`).then(async msg => super.report(message.author.username, msg.content));
    }
};