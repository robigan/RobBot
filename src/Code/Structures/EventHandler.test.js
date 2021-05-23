/**
 * Base class for EventHandlers
 */

module.exports = class EventHandler {
    /**
     * Base class for event handlers
     * @constructor
     * @param {import("./RobiClient")} client 
     * @param {string} name 
     * @param {string} description 
     * @param {object} flags 
     */
    constructor(client, name, description, flags = {}) {
        this.client = client;
        this.name = name;
        this.description = description || "No description provided";
        this.flags = flags;
    }

    /**
     * Run event handler
     * @async
     * @function
     * @param {import("cloudstorm/dist/Types").IWSMessage} event
     * @param {*} data
     */
    async run(event, data) {
        console.log(`Event ${this.name} doesn't provide a run method, event type: ${event.t}`);
        console.log("And the Data:", data);
    }
};