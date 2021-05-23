const mongoose = require("mongoose");
const cachegoose = require("cachegoose");
const LocRes = new (require("../../LocationResolver.js"));
const BaseModel = require("./BaseModel.js");

module.exports = class DatabaseManager {
    /**
     * Base class for managing mongoose and providing methods specific to RobBot
     * @constructor
     * @param {Object} Config 
     */
    constructor(Config) {
        this.Mongoose = mongoose;
        this.Config = Config;
        this.Types = new Map();
    }

    /**
     * Start function for Database Manager
     * @async
     * @function
     */
    async start() {
        await cachegoose(this.Mongoose);
        this.Mongoose.connect(this.Config.Mongoose.connect.url, this.Config.Mongoose.connect.options);
    }

    /**
     * Loads the different database "types"
     * @async
     * @function
     */
    async loadTypes() {
        const Types = await LocRes.glob(await LocRes.redirect("src/Database/Types/*.js"));
        for (const Type of Types) {
            delete require.cache[Type];
            const Model = new (require(Type))(this);
            if (!(Model instanceof BaseModel)) throw new TypeError(`Model ${Model.name} doesn't belong in Commands`);
            if (this.Types.get(Model.name)) throw new SyntaxError(`Model ${Model.name} has already been defined, please rename it to something else`);
            this.Types.set(Model.name, Model);
        }
    }
};