const GatewayClient = require("./Gateway/Structures/GatewayClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const MainConfig = require("./Configs/Config.json");
const GatewayClientConfig = require("./Configs/GatewayClient.json");

module.exports = class Gateway {
    constructor(Config = Object.assign(GatewayClientConfig, MainConfig, SecretConfig)) {
        const Gateway = new GatewayClient(Config);
        //Client.start();
        return Gateway;
    }
};