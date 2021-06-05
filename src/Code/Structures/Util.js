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
                const ModulePath = LocRes.Path.dirname(ManifestPath) + (Manifest.entryPath || "/index.js");
                delete require.cache[ModulePath];
                const Module = new (require(ModulePath))(this.client, Manifest.config);
                (async () => {
                    Module.moduleWillLoad();
                    this.client.Modules.modules.set(Manifest.id, { "manifest": Manifest, "module": Module });
                })().catch(err => console.error("Error while loading modules\n", err));
            }
        });
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
        } else if (arr.length < maxLen) {
            arr.join(", ");
        }
        return arr;
    }

    /**
     * Makes easier sending an error with details back to the end user
     * @param {import("@amanda/discordtypings").InteractionData} Data 
     * @param {(Error|string)} Err 
     * @param {string} Type 
     */
    async sendErrorDetails(Data, Err, Type) {
        this.client.interaction.createInteractionResponse(Data.id, Data.token, {
            "type": 4, "data": {
                "content": `Error while processing the slash interaction.\nError type: ${Type}\nError details: ${Err.toString()}`,
                "flags": 64
            }
        }, );
    }
};