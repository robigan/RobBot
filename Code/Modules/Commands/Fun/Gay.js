const Command = require("../../../Structures/Command.js");
const MessageEmbed = require("../../../Structures/MessageEmbed.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        const Gay = Math.floor(Math.random() * 100);
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator}`)
            .setColor("LUMINOUS_VIVID_PINK")
            .setTitle("Gayometer")
            .setDescription("Measures how much gay you are")
            .addField("Gay Level", `You are ${Gay}% gay`)
            .setTimestamp();
        await this.client.channel.createMessage(message.channel_id, {embed: embed.toJSON()});
        super.report(message.author.username, `You are ${Gay}% gay`);
    }
};