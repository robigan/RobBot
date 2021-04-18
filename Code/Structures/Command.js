module.exports = class Command {
    constructor(client, name, options = {}, flags = {}) {
        this.client = client;
        this.name = name;
        this.aliases = options.aliases || [];
        this.description = options.description || "No description provided";
        this.category = options.category || "Miscellaneous";
        this.usage = options.usage || "No usage provided";
        this.flags = flags;
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        console.log(`Command ${this.name} doesn't provide a run method`);
    }

    async report(author, action) {
        console.log(`User ${author} invoked ${this.name}\u000AReplied with ${action}`);
    }
};