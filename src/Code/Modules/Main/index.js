module.exports = class Main {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async moduleWillLoad() {
        /** @param {import("@amanda/discordtypings").InteractionData} Data */
        const Ping = async (Data) => {
            await this.client.interaction.createInteractionResponse(Data.id, Data.token, { "type": 5 });
            /** @type {import("@amanda/discordtypings").MessageData} */
            const OrigInterRes = await this.client.interaction.getOriginalInteractionResponse(this.client.Identify.appID, Data.token);
            this.client.interaction.editOriginalInteractionResponse(this.client.Identify.appID, Data.token, {
                "embeds": [new (this.client.Modules.structures.get("MessageEmbed"))()
                    .setColor("YELLOW")
                    .setTimestamp()
                    .setTitle("Ping Statistics")
                    .addField("Round Trip Message Latency", `${Date.parse(OrigInterRes.timestamp) - new Date(Data.id / 4194304 + 1420070400000)}ms`)
                ]
            });
        };

        this.client.Modules.structures.get("Command").register("847538619773485068", Ping, {"name": "ping"});
    }
};