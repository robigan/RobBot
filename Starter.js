// JavaScript source code main entry point
const LocRes = new (require("./LocationResolver.js"));
const AmqpClient = new (require("./src/amqp/AmqpClient.js"))(require("./Configs/Config.json").amqp);

const Executer = async (/** @type {Array} */ Selective) => {
    Selective = Selective ?? [];
    const Instances = new Map();

    global.robbotLocRes = LocRes;
    global.robbotInstances = Instances;
    global.robbotAmqpClient = AmqpClient;

    const Modules = await LocRes.glob(await LocRes.redirect("/src/*/manifest.json"));
    for (const ManifestPath of Modules) {
        delete require.cache[ManifestPath];
        /** @type {{"id": string, "name": string, "version": string, "description": string, "author": string, "entryPath": string, "type": ("executable" | "dependency" | "other")}} */
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
        //if (Manifest.type !== "executable") continue;
        if (!Selective.includes(Manifest.id)) continue;
        
        const ModulePath = LocRes.Path.dirname(ManifestPath) + (Manifest.entryPath || "/index.js");
        delete require.cache[ModulePath];
        const Obj = { "manifest": Manifest };
        if (Manifest.type === "executable") {
            const Module = require(ModulePath)(undefined, AmqpClient);
            Obj.module = Module;
        }
        Instances.set(Manifest.id, Obj);
    }
};

module.exports = function(/** @type {Array} */ Selective) {
    Executer(Selective).catch(console.error);
};