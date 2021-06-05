module.exports = class Test {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async moduleWillLoad() {
        /** @type {import("@amanda/discordtypings").ApplicationCommand} */
        this.AppCommand = this.client.Modules.structures.get("Command").register("846097331518439485", async (Data) => {
            this.client.interaction.createInteractionResponse(Data.id, Data.token, {"type": 4, "data": {"content": "Hello World!"}});
        }, {"name": "test"});
    }

    async moduleWillUnload() {
        this.client.Modules.structures.get("Command").unregister(this.AppCommand.id);
    }
};