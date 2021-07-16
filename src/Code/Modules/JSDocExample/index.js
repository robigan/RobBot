module.exports = class JSDocExample {
    /**
     * @constructor
     * @param {import("../../Structures/RobiClient.js")} client
     * @param {import("./manifest.json").config} config
     */
    constructor(client, config) {
        this.client = client;
        this.config = config;
    }

    async moduleWillLoad() {
        console.log("Hello world from the JSDocExample module, if u see this there most likely is a bug, please report immediately");
    }

    async moduleWillUnload() {
        console.log("If u see this it's most likely a bug, please report immediately");
    }
};