const BaseModel = require("../BaseModel.js");

module.exports = class guilds extends BaseModel {
    constructor(database) {
        super(database, "guilds");
        this.schema = new this.database.Mongoose.Schema({
            prefix: String,
            id: String,
            _id: String
        }, {
            collection: this.name
        });
        this.schema.pre("save", function(next) {
            this._id = this.id;
            next();
        });
        this.model = this.database.Mongoose.model(this.name, this.schema);
    }
};