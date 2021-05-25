module.exports = class Model {
    /**
     * Base class for database types
     * @constructor
     * @param {import("./Database.js")} database 
     * @param {string} name 
     */
    constructor(database, name) {
        this.database = database;
        this.name = name;
        this.schema = null;
        this.model = null;
    }
};