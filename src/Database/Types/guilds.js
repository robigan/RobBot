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
            if (this._id && !this.id) {
                this.id = this._id;
            } else if (!this._id && this.id) {
                this._id = this.id;
            } else if (this._id && this.id && (this._id !== this.id)) {
                throw new Error("this._id and this.id do not match!");
            }
            this.dataStore ? undefined : this.dataStore = {};
            this.configStore ? undefined : this.configStore = {};
        });

        const ifNotExistOneThenCreate = async function(result) {
            const Filter = this.getFilter();
            if (!result || (result.n === 0 && result.nModified === 0) && Filter._id) {
                const getUpdate = this.getUpdate();
                const MyNewModel = new this.model(Object.assign(Filter, getUpdate ? getUpdate.$set : {}));
                await MyNewModel.save();
            }
        };
        //this.schema.post("find", ifNotExistThenUpdate);
        this.schema.post("findOne", ifNotExistOneThenCreate);
        this.schema.post("findOneAndUpdate", ifNotExistOneThenCreate);
        this.schema.post("updateOne", ifNotExistOneThenCreate);
        this.schema.post("updateMany", ifNotExistOneThenCreate);
        this.model = this.database.Mongoose.model(this.name, this.schema);
    }
};