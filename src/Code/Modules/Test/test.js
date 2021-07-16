module.exports = class Test {
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
        /** @type {import("@amanda/discordtypings").ApplicationCommand} */
        this.client.Struct.get("IntPi").registerCommand(this.config.testCmdID, async (Data) => {
            this.IntPi.editResponse(Data, {"content": "Hello World!"});
        }, {"name": "test"});
    }

    async moduleWillUnload() {
        this.IntPi.unregisterCommand(this.config.testCmdID);
    }
};