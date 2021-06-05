module.exports = class Main {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client, config) {
        this.client = client;
        this.config = config;
        /** @type {import("../../Structures/Command.js")} */
        this.Command = this.client.Modules.structures.get("Command");
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
            if (Data.data.options[0].name === "config") {
                if ((Data.data.options[0].options) && Data.data.options[0].options[0].name === "channel") {
                    this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 4, "data": { "content": "Updating issues channel configuration" } }).then(() => {
                        setTimeout(async () => this.client.interaction.deleteOriginalInteractionResponse(this.client.Identify.appID, Data.token), 5000);
                    });
                    await this.client.Database.Types.get("guilds").model.findByIdAndUpdate(Data.guild_id, { "configStore": { "issues": { "issuesChannel": Data.data.options[0].options[0].value } } });
                } else {
                    await this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 5 });
                    this.client.interaction.editOriginalInteractionResponse(this.client.Identify.appID, Data.token, {
                        "embeds": [new (this.client.Modules.structures.get("MessageEmbed"))()
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
                    this.client.Utils.sendErrorDetails(Data, new Error("Make sure to set an issues channel before using issues"), "Missing data when returned by Database");
                    return false;
                }
            });
            if (!IssuesChannel) return;
            if (Data.data.options[0].name === "create") {
                this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 4, "data": { "content": "Ok! Sent your issue" } }).then(() => {
                    setTimeout(async () => this.client.interaction.deleteOriginalInteractionResponse(this.client.Identify.appID, Data.token), 5000);
                });
                this.client.channel.createMessage(IssuesChannel, {
                    "embed": new (this.client.Modules.structures.get("MessageEmbed"))()
                        .setColor("ORANGE")
                        .setTimestamp()
                        .setFooter("Bug ID is Message ID") // To modify
                        .setAuthor(`${Data.member.user.username}#${Data.member.user.discriminator} (${Data.member.user.id})`)
                        .addField(Data.data.options[0].options[0].value, Data.data.options[0].options[1].value)
                        .addField("Files", "_No files attached_")
                        .addField("Status:", "Under Review", true)
                        .addField("Reason", "_No response currently_", true),
                    "content": `:bug: From: <#${Data.channel_id}>`
                });
            }
            else if (Data.data.options[0].name === "reply") {
                this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 4, "data": { "content": `The subcommand was delete! With value ${Data.data.options[0].value}` } }).then(() => {
                    setTimeout(async () => this.client.interaction.deleteOriginalInteractionResponse(this.client.Identify.appID, Data.token), 5000);
                });
                const OrigInterRes = await this.client.channel.getChannelMessage(IssuesChannel, Data.data.options[0].options[0].value);
                const Embed = new (this.client.Modules.structures.get("MessageEmbed"))(OrigInterRes.embeds[0]);
                Embed.fields[3].value = Data.data.options[0].options[1].value;

                this.client.channel.editMessage(IssuesChannel, Data.data.options[0].options[0].value, { "embed": Embed, "content": OrigInterRes.content });
            }
            else if (Data.data.options[0].name === "mark") {
                this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 4, "data": { "content": "Ok, modifying state" } }).then(() => {
                    setTimeout(async () => this.client.interaction.deleteOriginalInteractionResponse(this.client.Identify.appID, Data.token), 5000);
                });
                const OrigInterRes = await this.client.channel.getChannelMessage(IssuesChannel, Data.data.options[0].options[0].value);
                const Embed = new (this.client.Modules.structures.get("MessageEmbed"))(OrigInterRes.embeds[0]);
                Embed.fields[2].value = Data.data.options[0].options[1].value;
                Embed.setColor(this.Colors[Data.data.options[0].options[1].value]);

                this.client.channel.editMessage(IssuesChannel, Data.data.options[0].options[0].value, { "embed": Embed, "content": OrigInterRes.content });
            }
        };
        this.Command.register("849636767070289927", Issues, { "name": "issues" });
    }
};