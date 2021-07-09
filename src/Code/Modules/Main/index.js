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
    }

    async moduleWillLoad() {
        /** @param {import("@amanda/discordtypings").InteractionData} Data */
        const Ping = async (Data, Event) => {
            /** @type {import("@amanda/discordtypings").MessageData} */
            const OrigInterRes = await this.client.interaction.getOriginalInteractionResponse(this.client.Identify.appID, Data.token);
            this.IntPi.editResponse(Data, {
                "embeds": [new (this.client.Struct.get("MessageEmbed"))()
                    .setColor("YELLOW")
                    .setTimestamp()
                    .setTitle("Ping Statistics")
                    .addField(":airplane_departure: :airplane: :airplane_arriving:", `${Date.parse(OrigInterRes.timestamp) - new Date(Data.id / 4194304 + 1420070400000)}ms`)
                    .addField(":passport_control: Gateway PID", Event.stats.gatewayPID, true)
                    .addField(":bullettrain_side: Cache PID", Event.stats.cachePID, true)
                    .addField(":gear: Code PID", process.pid, true)
                ]
            });
        };

        /** @param {import("@amanda/discordtypings").InteractionData} Data */
        const Info = async (Data, Event) {
            this.IntPi.editResponse(Data, {
                "embeds":[new (this.client.Struct.get("MessageEmbed"))()
                    .setColor("YELLOW")
                ]
            })
        }

        this.IntPi.registerCommand("847538619773485068", Ping, {"name": "ping"});
    }
};