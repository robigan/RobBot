const EventHandler = require("../../Structures/EventHandler.js");

module.exports = class extends EventHandler {
    constructor(...args) {
        super(...args, "Default ready event handler");
    }

    async run(event, data) {
        this.client.user = data.user;
        this.client.guilds = data.guilds;
        //this.shard = data.shard ?? null;
    }
};