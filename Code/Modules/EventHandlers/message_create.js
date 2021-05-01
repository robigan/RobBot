const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default message event handler");
    }

    async run(event, message) {
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

        if (!message.guild_id || (await this.client.Cache.user.get(message.author.id)).bot === true) return;

        if (message.content.match(mentionRegex)) message.reply(`My prefix for this guild is \`${this.prefix}\` :D`);
        const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        //To patch running multiple commands
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        this.client.debug.command && command ? console.log(`Frontend Command: ${cmd} Args: ${args}\nBackend Command:`, command.name) : undefined;
        if (command) {
            command.run(message, args).catch(err => {
                console.error(err);
                this.client.channel.createMessage(message.channel_id, `<@${message.author.id}> Error when running command, ${err}`);
            });
        }
    }
};