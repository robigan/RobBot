module.exports = class Help {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     * @param {import("./manifest.json").config} config
     */
    constructor(client, config) {
        this.client = client;
        this.config = config;
        /** @type {import("../../Structures/InteractionPipeline.js")} */
        this.IntPi = this.client.Struct.get("IntPi");
    }

    async moduleWillLoad() {
        /** @param {import("@amanda/discordtypings").InteractionData} Data */
        const Help = async (Data) => {
            this.IntPi.editResponse(Data, {
                "embeds": [
                    new (this.client.Struct.get("MessageEmbed"))()
                        .setColor("BLURPLE")
                        .setFooter("RobBot mental help")
                        .setTitle("Help page - Main Module")
                        .setDescription("Tip: If you don't see the buttons below, then update your discord client")
                        .setTimestamp(""),
                    new (this.client.Struct.get("MessageEmbed"))().set
                ]
            });
        };

        this.IntPi.registerCommand(this.config.helpCmdID, Help, {"name": "help"});
    }
};