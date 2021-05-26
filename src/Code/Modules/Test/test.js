module.exports = class Test {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async moduleWillLoad() {
        this.client.Modules.structures.get("Command").register(undefined, async (Data) => {
            this.client.interaction.createInteractionResponse(Data.id, Data.token, {"type": 4, "data": {"content": "Hello World!"}});
        }, {"name": "test", "description": "Test command that helps check that the full interaction system works..."});
    }
};