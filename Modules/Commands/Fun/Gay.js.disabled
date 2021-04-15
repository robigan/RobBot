const Command = require("../../../Structures/Command.js");
const { MessageEmbed } = require("discord.js");
const { gays: Gays } = require("../../../Configs/Words.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        const Gay = Gays.includes(message.author.id) ? "100" : Math.floor(Math.random() * 100);
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag)
            .setColor("LUMINOUS_VIVID_PINK")
            .setTitle("Gayometer")
            .setDescription("Measures how much gay you are")
            .addField("Gay Level", `You are ${Gay}% gay`)
            .setTimestamp();
        message.channel.send(embed).then(() => {
            super.report(message.author.username, `You are ${Gay}% gay`);
        });
    }
};