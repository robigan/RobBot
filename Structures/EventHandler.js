module.exports = class EventHandler {
    constructor(client, name, description, flags = {}) {
        this.client = client;
        this.name = name;
        this.description = description || "No description provided";
        this.flags = flags;
    }
};