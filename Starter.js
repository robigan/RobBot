/**
 * @typedef {{"id": string, "name": ?string, "version": string, "description": ?string, "author": ?string, "entryPath": string, "config": ?Object, "type": ("executable" | "dependency" | "other" )}} Manifest
 */

// JavaScript source code main entry point
const LocRes = new (require("./LocationResolver.js"));
const AmqpClient = new (require("./src/amqp/AmqpClient.js"))(require("./src/Config/manifest.json").config.amqp);

module.exports = async (/** @type {Array} */ Selective = []) => {
    try {
        /**
         * @type {Map<string, {"manifest": Manifest, "path": string, "module": ?any}>}
         */
        const Instances = new Map();

        global.robbotLocRes = LocRes;
        global.robbotInstances = Instances;
        global.robbotAmqpClient = AmqpClient;

        const Modules = await LocRes.glob(await LocRes.redirect("/Modules/All/*/manifest.json"));
        for (const ManifestPath of Modules) {
            delete require.cache[ManifestPath];
            /** @type {Manifest} */
            const Manifest = require(ManifestPath);

            if (!Manifest.id) throw new TypeError(`Module (at ${LocRes.Path.dirname(ManifestPath)}) doesn't have an ID property`);
            if (!Manifest.version) throw new TypeError(`Module ${Manifest.id} doesn't have a version property`);
            if (!Manifest.entryPath) throw new TypeError(`Module ${Manifest.id} doesn't have an entryPath property`);
            if (!Manifest.type) console.warn(`Module ${Manifest.id} doesn't have a type property, it is advised to have a type property`);
            Manifest.name = Manifest.name ?? Manifest.id;
            Manifest.description = Manifest.description ?? "No description provided";
            Manifest.author = Manifest.author ?? "Unknown author";
            Manifest.type = Manifest.type ?? "executable";

            if (Instances.get(Manifest.id)) throw new SyntaxError(`Module ${Manifest.id} has already been loaded`);
            if (!Selective.includes(Manifest.id)) continue;

            const ModulePath = LocRes.Path.dirname(ManifestPath) + (Manifest.entryPath || "/index.js");
            delete require.cache[ModulePath];
            Instances.set(Manifest.id, { "manifest": Manifest, "path": ModulePath });
        }

        for (const ManifestID of Selective) {
            const Module = Instances.get(ManifestID);
            if (Module.manifest.type !== "executable") continue;
            Instances.set(ManifestID, Object.assign(Module, { "module": require(Module.path) }));
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};