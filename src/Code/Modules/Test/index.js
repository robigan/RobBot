module.exports = class Test {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async pluginWillLoad() {
        this.client.Modules.structures.get("Command").register("test", async (Message) => {
            this.client.channel.createMessage(Message.channel_id, "Test");
            console.log("Ran test command");
        });
        this.client.Modules.structures.get("EventHandler").register("message_create", async () => {
            console.log("A message came in!");
        });
    }
};