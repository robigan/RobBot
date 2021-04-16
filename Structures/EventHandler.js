module.exports = class EventHandler {
    constructor(client, name, description, flags = {}) {
        this.client = client;
        this.name = name;
        this.description = description || "No description provided";
        this.flags = flags;
    }

    async run(event, data) {
        console.log(`Event ${this.name} doesn't provide a run method, event type: ${event.t}`);
        console.log("And the Data:", data);
    }
};