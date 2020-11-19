const { Client, Collection } = require("discord.js");
//const log = require('log');
const Util = require("./Util.js");

module.exports = class RobiClient extends Client {
    constructor(config = {}, LocRes) {
        super({
            messageCacheMaxSize: 200,
            messageCacheLifetime: 3600,
            messageSweepInterval: 60
        });
        this.validate(config, LocRes);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.utils = new Util(this);

        this.once("ready", () => {
            console.log(`Logged is as ${this.user.tag}`);
        });

        this.on("message", async (message) => {
            //const mentionRegex = RegExp(`^<@!${this.user.id}>$`);
            const mentionRegexPrefix = RegExp(`^<@!${this.user.id}> `);

            function STFU (Chance) {
                if (Math.floor(Math.random()*Chance) === 1) {
                    message.reply("STFU");
                    return true;
                }
            }
            if (STFU(100)) return;

            if (!message.guild || message.author.bot) return;

            //if (message.content.match(mentionRegex)) message.reply(`My prefix for this guild is \`${this.prefix}\` :D`);

            const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.prefix;
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

            //To patch running multiple commands
            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
            if (command) {
                if (STFU(20)) return;
                message.guild.fetch().catch(err => {
                    console.error(err);
                }); //Update the cache for this server
                command.run(message, args).catch(err => {
                    console.error(err);
                }); // Y not
            }
        });
    }

    validate(config, LocRes) {
        if ((typeof config !== "object") && (typeof LocRes !== "object")) throw new TypeError("Config and LocRes should be a type of Object");
        this.locRes = LocRes;

        if (!config.token) throw new Error("You must pass the token for the client");
        this.token = config.token;

        if (!config.prefix) throw new Error("You must pass a prefix for the client");
        if (typeof config.prefix !== "string") throw new TypeError("Prefix should be a type of String");
        this.prefix = config.prefix;

        this.config = config;
    }

    async start(token = this.token) {
        this.utils.loadCommands();
        super.login(token);
    }
};