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
            const Embed = new (this.client.Struct.get("MessageEmbed"))()
                .setColor("BLURPLE")
                .setFooter("RobBot mental help")
                .setTitle("Help Pages")
                .setDescription("Tip: If you don't see the buttons below, then update your discord client (WIP)")
                .setTimestamp();
                
            this.IntPi.editResponse(Data, {
                "embeds": [
                    Embed
                ]
            });
        };

        this.IntPi.registerCommand(this.config.helpCmdID, Help, { "name": "help" });
    }
};