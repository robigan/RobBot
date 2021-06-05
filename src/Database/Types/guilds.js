const BaseModel = require("../BaseModel.js");

module.exports = class guilds extends BaseModel {
    constructor(database) {
        super(database, "guilds");
        this.schema = new this.database.Mongoose.Schema({
            id: String,
            dataStore: {},
            configStore: {},
            _id: String
        }, {
            collection: this.name,
            minimize: false,
            strict: false
        });
        this.schema.pre("save", async function() {
            this._id = this.id;
            this.dataStore = {};
            this.configStore = {};
        });

        const ifNotExistThenUpdate = async function(result) {
            if (!result) {
                const MyNewModel = new this.model({id: this.getQuery()});
                await MyNewModel.save();
            }
        };
        this.schema.post("find", ifNotExistThenUpdate);
        this.schema.post("findOne", ifNotExistThenUpdate);
        this.schema.post("findOneAndUpdate", ifNotExistThenUpdate);
        this.schema.post("update", ifNotExistThenUpdate);
        this.schema.post("updateOne", ifNotExistThenUpdate);
        this.schema.post("updateMany", ifNotExistThenUpdate);
        this.model = this.database.Mongoose.model(this.name, this.schema);
    }
};