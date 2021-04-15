const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default message event handler");
    }

    async main(event, message) {
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

        if (!message.guild || message.author.bot) return;

        if (message.content.match(mentionRegex)) message.reply(`My prefix for this guild is \`${this.prefix}\` :D`);
        const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        //To patch running multiple commands
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (command) {
            message.guild.fetch().catch(err => {
                console.error(err);
                message.reply(`Error when fetching guild update, ${err}`);
            });
            command.run(message, args).catch(err => {
                console.error(err);
                message.reply(`Error when running command, ${err}`);
            });
        }
    }
};