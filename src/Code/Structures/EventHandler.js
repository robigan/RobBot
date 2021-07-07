/**
 * Base class for EventHandlers
 */

module.exports = class EventHandler {
    /**
     * Base class for event handlers
     * @constructor
     * @param {import("./RobiClient")} client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Register an event handler
     * @param {string} event_type
     * @param {function(import("cloudstorm/dist/Types").IWSMessage, *)} handler
     */
    async register(event_type, handler) {
        if (this.client.Modules.eventHandlers.get(event_type.toLowerCase())) throw new SyntaxError(`Event handler ${event_type} has already been registered`);
        this.client.Modules.eventHandlers.set(event_type.toLowerCase(), handler);
    }

    /**
     * Unregister an event handler
     * @param {string} event_type 
     */
    async unregister(event_type) {
        this.client.Modules.eventHandlers.delete(event_type);
    }
};