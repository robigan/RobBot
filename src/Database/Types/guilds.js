const BaseModel = require("../BaseModel.js");

module.exports = class guilds extends BaseModel {
    constructor(database) {
        super(database, "guilds");
        this.schema = new this.database.Mongoose.Schema({
            prefix: String,
            _id: String
        });
        this.model = this.database.Mongoose.model(this.name, this.schema);
    }
};