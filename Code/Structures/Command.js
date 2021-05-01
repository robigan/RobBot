module.exports = class Command {
    /**
     * Base class for commands
     * @constructor
     * @param {import("./RobiClient")} client 
     * @param {string} name 
     * @param {object} options 
     * @param {object} flags 
     */
    constructor(client, name, options = {}, flags = {}) {
        this.client = client;
        this.name = name;
        this.aliases = options.aliases || [];
        this.description = options.description || "No description provided";
        this.category = options.category || "Miscellaneous";
        this.usage = options.usage || "No usage provided";
        this.flags = flags;
    }

    /**
     * Run command
     * @async
     * @function
     * @param {Object} Message
     * @param {...string} Args
     */
    async run() {
        console.log(`Command ${this.name} doesn't provide a run method`);
    }

    async report(author, action) {
        console.log(`User ${author} invoked ${this.name}\u000AReplied with ${action}`);
    }
};