module.exports = class Test {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async moduleWillLoad() {
        this.client.Modules.structures.get("Command").register("test", async (Data) => {
            this.client.interaction.createInteractionResponse(Data.id, Data.token, {"type": 4, "data": {"content": "Hello World!"}});
        });
        /*this.client.Modules.structures.get("EventHandler").register("message_create", async () => {
            console.log("A message came in!");
        });*/
    }
};