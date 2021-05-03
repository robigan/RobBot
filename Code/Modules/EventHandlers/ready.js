const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default ready event handler");
    }

    /**
     * Run ready event handler
     * @async
     * @function
     * @param {import("cloudstorm/dist/Types").IWSMessage} event
     * @param {import("@amanda/discordtypings").ReadyData} data
     */
    async run(event, data) {
        this.client.identifiers.selfID = data.user.id;
        console.log("Code    : Received ready event");
    }
};