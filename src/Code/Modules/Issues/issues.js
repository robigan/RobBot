module.exports = class Main {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client, config) {
        this.client = client;
        this.config = config;
        /** @type {import("../../Structures/InteractionPipeline.js")} */
        this.IntPi = this.client.Struct.get("IntPi");
        this.Colors = {
            "Under Review": "ORANGE",
            "Accepted": "GREEN",
            "Denied": "RED",
            "Duplicate": "PURPLE"
        };
    }

    async moduleWillLoad() {
        /** @param {import("@amanda/discordtypings").InteractionData} Data */
        const Issues = async (Data) => {
            if (!Data.guild_id) { this.IntPi.sendErrorDetails(Data, new TypeError("Please execute this in a guild"), "Guild Verification failure"); return; }
            if (Data.data.options[0].name === "config") {
                if ((Data.data.options[0].options) && Data.data.options[0].options[0].name === "channel") {
                    this.IntPi.editResponse(Data, { "content": "Updating issues channel configuration", "flags": 64 });
                    await this.client.Database.Types.get("guilds").model.updateOne({ "_id": Data.guild_id }, { "configStore": { "issues": { "issuesChannel": Data.data.options[0].options[0].value } } });
                } else {
                    this.IntPi.editResponse(Data, {
                        "embeds": [new (this.client.Struct.get("MessageEmbed"))()
                            .setColor("WHITE")
                            .setTimestamp()
                            .setTitle("Issues configuration")
                            .addField("Configuration",
                                await this.client.Database.Types.get("guilds").model.findById(Data.guild_id).lean().then(doc => {
                                    if (!doc.configStore.issues) return "_No existent configuration_";
                                    else return JSON.stringify(doc.configStore.issues);
                                })
                            )
                        ]
                    });
                }
                return;
            }

            const IssuesChannel = await this.client.Database.Types.get("guilds").model.findById(Data.guild_id).lean().then(doc => {
                if (doc.configStore.issues && doc.configStore.issues.issuesChannel) return doc.configStore.issues.issuesChannel;
                else {
                    this.IntPi.sendErrorDetails(Data, new Error("Make sure to set an issues channel before using issues using \"/issues config channel: {channelID}\""), "Missing Data in Database");
                    return false;
                }
            });
            if (!IssuesChannel) return;

            if (Data.data.options[0].name === "create") {

                this.client.channel.createMessage(IssuesChannel, {
                    "embeds": [
                        new (this.client.Struct.get("MessageEmbed"))()
                            .setColor("ORANGE")
                            .setTimestamp()
                            .setFooter("Bug ID is Message ID") // To modify
                            .setAuthor(`${Data.member.user.username}#${Data.member.user.discriminator} (${Data.member.user.id})`)
                            .addField(Data.data.options[0].options[0].value, Data.data.options[0].options[1].value)
                            .addField("Files", "_No files attached_\n\n***Note this feature is currently disabled and only present for backwards compatability***")
                            .addField("Status:", "Under Review", true)
                            .addField("Reason", "_No response currently_", true)
                            .setTitle("RobBot Issues")], // To modify
                    "content": `:bug: From: <#${Data.channel_id}>`
                }).then(async (Message) => {
                    this.IntPi.editResponse(Data, { "content": "Your issue has been sent!", "flags": 64 });
                    const Embed = Object.assign({}, Message.embeds[0]);
                    Embed.footer.text = `Bug ID: ${Message.id}`;

                    this.client.channel.editMessage(IssuesChannel, Message.id, { "embeds": [Embed], "content": Message.content });
                }).catch(Err => this.IntPi.sendErrorDetails(Data, Err, "createMessage"));
            }
            else if (Data.data.options[0].name === "reply") {
                if (!this.client.Struct.get("Utils").checkPerms(Data.member.user.id, Data.guild_id, undefined, undefined, BigInt(1 << 13))) {
                    this.IntPi.sendErrorDetails(Data, new Error("Missing permissions"), "Permission issue");
                    return;
                }

                const IssueMessage = await this.client.channel.getChannelMessage(IssuesChannel, Data.data.options[0].options[0].value);

                const Embed = new (this.client.Struct.get("MessageEmbed"))(IssueMessage.embeds[0]);
                if (!(Embed.title === "RobBot Issues") && IssueMessage.member.user.id === this.client.Identify.selfID) {
                    this.IntPi.sendErrorDetails(Data, new Error("The specified message isn't a RobBot Issue"), "Check issue");
                    return;
                }
                Embed.fields[3].value = Data.data.options[0].options[1].value;

                this.client.channel.editMessage(IssuesChannel, Data.data.options[0].options[0].value, { "embeds": [Embed], "content": IssueMessage.content });

                this.dmUpdate(Embed, `Your issue ${Embed.fields[0].name} was replied to with: ${Data.data.options[0].options[1].value}`);

                this.IntPi.editResponse(Data, { "content": "State has been modified!", "flags": 64 });
            }
            else if (Data.data.options[0].name === "mark") {
                if (!this.client.Struct.get("Utils").checkPerms(Data.member.user.id, Data.guild_id, undefined, undefined, BigInt(1 << 13))) return;

                const IssueMessage = await this.client.channel.getChannelMessage(IssuesChannel, Data.data.options[0].options[0].value);

                const Embed = new (this.client.Struct.get("MessageEmbed"))(IssueMessage.embeds[0]);
                if (!(Embed.title === "RobBot Issues") && IssueMessage.member.user.id === this.client.Identify.selfID) {
                    this.IntPi.sendErrorDetails(Data, new Error("The specified message isn't a RobBot Issue"), "Check issue");
                    return;
                }
                Embed.fields[2].value = Data.data.options[0].options[1].value;
                Embed.setColor(this.Colors[Data.data.options[0].options[1].value]);

                this.client.channel.editMessage(IssuesChannel, Data.data.options[0].options[0].value, { "embeds": [Embed], "content": IssueMessage.content });

                this.dmUpdate(Embed, `Your issue ${Embed.fields[0].name} was marked: ${Data.data.options[0].options[1].value}`);

                this.IntPi.editResponse(Data, { "content": "State has been modified!", "flags": 64 });
            }
        };
        this.IntPi.registerCommand("849636767070289927", Issues, { "name": "issues" });
    }

    /**
     * Helpful function that DMs updates to users when their issue was updated
     * @param {{author: {name: String, iconURL: String, url: String}}} Embed 
     * @param {String} Description 
     */
    async dmUpdate(Embed, Description) {
        const UserId = Embed.author.name.match(/\(\d*\)/s)[0].slice(1, -1);
        await this.client.channel.createMessage(await (await this.client.user.createDirectMessageChannel(UserId)).id, {
            "embeds": [
                new (this.client.Struct.get("MessageEmbed"))()
                    .setColor("YELLOW")
                    .setTimestamp()
                    .setTitle("Issue updated")
                    .setDescription(Description)
            ]
        });
    }
};