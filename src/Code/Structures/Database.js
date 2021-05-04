const mongoose = require("mongoose");

module.exports = class DatabaseManager {
    /**
     * Base class for managing mongoose and providing methods specific to RobBot
     * @constructor
     * @param {Object} Config 
     */
    constructor(Config) {
        this.Mongoose = mongoose;
        this.Config = Config;
    }

    /**
     * Start function for Database Manager
     * @async
     * @function
     */
    async start() {
        this.Mongoose.connect(this.Config.Mongoose.connect.url, this.Config.Mongoose.connect.options);
    }
};