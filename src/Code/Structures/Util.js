//const EventHandler = require("./EventHandler.js");
const LocRes = new (require("../../../LocationResolver.js"));

module.exports = class Util {
    /**
     * Constructor for utils
     * @constructor
     * @param {import("./RobiClient")} client 
     */
    constructor(client) {
        this.client = client;
        this.LocRes = LocRes;
    }

    /**
     * Checks if input is a class
     * @param {Function} input
     * @returns {boolean}
     */
    isClass(input) {
        return typeof input === "function" && typeof input.prototype === "object" &&
        input.toString().substring(0, 5) === "class";
    }

    /**
     * Load event handlers
     * @async
     * @function
     */
    async loadModules() {
        console.warn("Code    : Remember, only load Modules you trust");
        LocRes.glob(await LocRes.redirect("/Modules/Code/*/manifest.json")).then((modules) => {
            for (const ManifestPath of modules) {
                delete require.cache[ManifestPath];
                const Manifest = require(ManifestPath);
                if (this.client.Modules.modules.get(Manifest.id)) throw new SyntaxError(`Event ${Manifest.id} has already been loaded`);
                const PluginPath = LocRes.Path.dirname(ManifestPath) + "/index.js";
                delete require.cache[PluginPath];
                const Plugin = new (require(PluginPath))(this.client);
                (async () => {
                    Plugin.pluginWillLoad();
                    this.client.Modules.modules.set(Manifest.id, {"manifest": Manifest, "plugin": Plugin});
                })().catch(err => console.error("Error while loading modules\n", err));
            }
        });
    }

    async makeGatewayRequest(content) {
        this.client.Modules.channel.sendToQueue(this.client.Config.amqp.queueCodeGateway, content);
    }

    /**
     * Format an array to be cut off after maxLen, useful for formatting roles
     * @function
     * @async
     * @param {import("@amanda/discordtypings").RoleData[]} arr 
     * @param {number} maxLen 
     * @returns {import("@amanda/discordtypings").RoleData[]}
     */
    async formatRoles(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        } else if(arr.length < maxLen) {
            arr.join(", ");
        }
        return arr;
    }
};