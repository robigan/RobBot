module.exports = class Util {
    /**
     * Constructor for utils
     * @constructor
     * @param {import("./RobiClient")} client 
     */
    constructor(client) {
        this.client = client;
        this.LocRes = global.robbotLocRes;
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
        const Modules = await this.LocRes.glob(await this.LocRes.redirect("/Modules/Code/*/manifest.json"));
        for (const ManifestPath of Modules) {
            delete require.cache[ManifestPath];
            /** @type {{"id": string, "name": ?string, "version": string, "description": ?string, "author": ?string, "entryPath": string, "config": ?Object, "type": ("executable" | "dependency" | "other"), "manPage": ?(Array<string> | string )}} */
            const Manifest = require(ManifestPath);

            if (!Manifest.id) throw new TypeError(`Module (at ${this.LocRes.Path.dirname(ManifestPath)}) doesn't have an ID property`);
            if (!Manifest.version) throw new TypeError(`Module ${Manifest.id} doesn't have a version property`);
            if (!Manifest.entryPath) throw new TypeError(`Module ${Manifest.id} doesn't have an entryPath property`);
            if (!Manifest.type) console.warn(`Module ${Manifest.id} doesn't have a type property, it is advised to have a type property`);
            Manifest.name = Manifest.name ?? Manifest.id;
            Manifest.description = Manifest.description ?? "No description provided";
            Manifest.author = Manifest.author ?? "Unknown author";
            Manifest.type = Manifest.type ?? "executable";

            if (this.client.Modules.modules.get(Manifest.id)) throw new SyntaxError(`Module ${Manifest.id} has already been loaded`);
            if (Manifest.type !== "executable") continue;

            const ModulePath = this.LocRes.Path.dirname(ManifestPath) + (Manifest.entryPath || "/index.js");
            delete require.cache[ModulePath];

            /**
             * @type {import("../Modules/JSDocExample/index.js")}
             */
            const Module = new (require(ModulePath))(this.client, Manifest.config);
            (async () => {
                await Module.moduleWillLoad();
                this.client.Modules.modules.set(Manifest.id, { "manifest": Manifest, "module": Module });
            })().catch(console.error);
        }
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
     * 
     * @param {String} userID 
     * @param {String} guildID 
     * @param {String} [channelID]
     * @param {String} [roleID]
     * @param {(BigInt | number)} perms 
     * @returns {{boolean, string=}}
     */
    async checkPerms(userID, guildID, channelID, roleID, perms) {
        if (!userID || !guildID) throw new TypeError("Provide a userID and guildID when checking for perms");
        //if (!channelID && !roleID) throw new TypeError("Provide a channelID and/or roleID when checking for perms");
        if (!perms) throw new TypeError("Provide a permission value to calculate for");
        const TargetPerm = BigInt(perms);
        if (roleID && !channelID) {
            const Member = await this.client.Cache.member.get(userID, guildID);
            const Role = await this.client.Cache.role.get(roleID, guildID);
            if ((Member === null) || (Role === null)) return false, "Data requested not cached";
            if (Member.boundObject.roles.includes(roleID)) return false, "Member doesn't have specified role";
            const RolePerm = BigInt(Role.boundObject.permissions);
            return BigInt(RolePerm & TargetPerm) === BigInt(0) ? false : true; // If the Role the user has contains the permission we requested and don't equal 0, then true
        } else if (!roleID && channelID) {
            const Member = await this.client.Cache.member.get(userID, guildID);
            const Channel = await this.client.Cache.channel.get(channelID);
            if ((Member === null) || (Channel === null)) return false, "Data requested not cached";
            if (await Channel.boundObject.permission_overwrites.every(async value => { // Just think of it returning true if the user isn't allowed
                const Overwrite = await this.client.Cache.permOverwrite.get(value, channelID);
                if (Overwrite === null) return false, "Data requested not cached";
                if (Overwrite.boundObject.type === 0 && !Member.boundObject.roles.includes(value)) return true; // Return true bc it's to be ignored and not affect results
                if (Overwrite.boundObject.type === 1 && value !== Member.boundObject.user.id) return true;
                if (!BigInt(BigInt(Overwrite.boundObject.deny) & TargetPerm) === BigInt(0)) return true;
                else if (!BigInt(BigInt(Overwrite.boundObject.allow) & TargetPerm) === BigInt(0)) return false;
            })) return false;
            else return true;
        } else if (!roleID && !channelID) { // Incase if channelID and roleID were not specified
            const Member = await this.client.Cache.member.get(userID, guildID);
            if ((Member === null)) return false, "Data requested not cached";
            if (await Member.boundObject.roles.every(async value => { // Just think of it returning true if the user isn't allowed
                return !(await this.checkPerms(userID, guildID, undefined, value, TargetPerm));
            })) return false;
            else return true;
        } else if (roleID && channelID) {
            const Member = await this.client.Cache.member.get(userID, guildID);
            const Overwrite = await this.client.Cache.permOverwrite.get(roleID, channelID);
            if ((Member === null) || (Overwrite === null)) return false, "Data requested not cached";
            if (!BigInt(BigInt(Overwrite.boundObject.deny) & TargetPerm) === BigInt(0)) return false;
            else if (!BigInt(BigInt(Overwrite.boundObject.allow) & TargetPerm) === BigInt(0)) return true;
            const Role = await this.client.Cache.role.get(roleID, guildID);
            if (Role === null) return false, "Data requested not cached";
            const RolePerm = BigInt(Role.boundObject.permissions);
            return BigInt(RolePerm & TargetPerm) === BigInt(0) ? false : true; // If the Role the user has contains the permission we requested and don't equal 0, then true
        }
        return false, "Function error";
    }
};