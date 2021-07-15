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
        const Info = async (Data) => {
            this.IntPi.editResponse(Data, {
                "embeds":[new (this.client.Struct.get("MessageEmbed"))()
                    .setColor("YELLOW")
                    .setTimestamp()
                    .setTitle("Bot Information")
                    .addField("General Information", `Node: ${process.versions.node}\nV8 engine: ${process.versions.v8}`)
                    .addField("Instances Information", (() => {
                        let TargetString = "";
                        /** @type {Map} */
                        global.robbotInstances.forEach((Obj) => {
                            TargetString += `${Obj.manifest.name} (${Obj.manifest.id}): ${Obj.manifest.version}\n`;
                        });
                        return TargetString;
                    })())
                    .addField("Modules Information (Code Instance)", (() => {
                        let TargetString = "";
                        /** @type {Map} */
                        this.client.Modules.modules.forEach((Obj) => {
                            TargetString += `${Obj.manifest.name} (${Obj.manifest.id}): ${Obj.manifest.version}\n`;
                        });
                        return TargetString;
                    })())
                ]
            });
        };

        this.IntPi.registerCommand(this.config.infoCmdID, Info, {"name": "info"});
        this.IntPi.registerCommand(this.config.pingCmdID, Ping, {"name": "ping"});
    }

    async moduleWillUnload() {

    }
};