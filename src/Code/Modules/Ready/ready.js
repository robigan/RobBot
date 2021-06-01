module.exports = class Ready {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     */
    constructor(client) {
        this.client = client;
    }

    async moduleWillLoad() {
        this.client.Modules.structures.get("EventHandler").register("ready", async (data) => {
            this.client.Identify.selfID = data.user.id;
            console.log("Code    : Received ready event");
        });
    }
};