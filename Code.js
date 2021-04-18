const RobiClient = require("./Code/Structures/RobiClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const MainConfig = require("./Configs/Config.json");
const RobiClientConfig = require("./Configs/RobiClient.json");

module.exports = class Code {
    constructor(Config = Object.assign(RobiClientConfig, MainConfig, SecretConfig)) {
        const Client = new RobiClient(Config);
        Client.start();
        return Client;
    }
};