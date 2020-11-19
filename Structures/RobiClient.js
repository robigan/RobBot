const { Client, Collection } = require("discord.js");
//const log = require('log');
const Util = require("./Util.js");

module.exports = class RobiClient extends Client {
    constructor(config = {}) {
        super({
            messageCacheMaxSize: 200,
            messageCacheLifetime: 3600,
            messageSweepInterval: 60
        });

        this.validate(config);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.eventHandlers = new Collection();
        this.utils = new Util(this);

        this.once("ready", () => {
            console.log(`Logged is as ${this.user.tag}`);
            console.info("Starting register process of event handlers");
            this.utils.loadEventHandlers().catch((err) => {
                console.error(err);
            });
            console.info("Register process of event handlers complete");
        });

        /*this.on('message', async (message) => {
            const mentionRegex = RegExp(`^<@!${this.user.id}>$`); //For the meantime
            const mentionRegexPrefix = RegExp(`^<@!${this.user.id}> `);

            function STFU (Chance) {
                if (Math.floor(Math.random()*Chance) === 1) {
                    message.reply("STFU");
                    return true;
                }
            }
            if (STFU(100)) return;

            if (!message.guild || message.author.bot) return;

            if (message.content.match(mentionRegex)) message.reply(`My prefix for this guild is \`${this.prefix}\` :D`); //For the meantime
            const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.prefix;
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

            //To patch running multiple commands
            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
            if (command) {
                if (STFU(20)) return;
                message.guild.fetch().catch(err => {
                    console.error(err);
                    message.reply(`Error when fetching guild update, ${err}`);
                });
                command.run(message, args).catch(err => {
                    console.error(err);
                    message.reply(`Error when running command, ${err}`);
                });
            }
        });*/
    }

    validate(config) {
        if (typeof config !== "object") throw new TypeError("Config and should be a type of Object");

        if (!config.token) throw new Error("You must pass the token for the client");
        this.token = config.token;

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");
        this.prefix = config.prefix;

        this.config = config;
    }

    async start(token = this.token) {
        await this.utils.loadCommands().catch((err) => {
            console.error(err);
        });
        super.login(token);
    }
};