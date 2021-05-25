const Database = new (require("./Database.js"))(require("../../Configs/RobiClient.json"));
module.exports = async () => {
    await Database.start();
    await Database.loadTypes();
    return Database;
};