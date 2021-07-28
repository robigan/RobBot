module.exports = class Man {
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

            const Man = this.client.Modules.commands.get(Data.data.options[0].value).options.man ?? "No man page provided";
            Embed.addField("Man Page:", Man);

            this.IntPi.editResponse(Data, {
                "embeds": [
                    Embed
                ]
            });
        };

        this.IntPi.registerCommand(this.config.manCmdID, Help, { "name": "man", "man": "Hello World!" });
    }
};