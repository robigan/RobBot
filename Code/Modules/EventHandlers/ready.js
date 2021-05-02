const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default ready event handler");
    }

    async run(event, data) {
        this.client.identifiers.selfID = data.user.id;
        console.log("Code    : Received ready event");
    }
};