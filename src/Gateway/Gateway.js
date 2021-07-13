/**
 * GatewayClient wrapper. Makes initiating the GatewayClient easier
 */

const GatewayClient = require("./Structures/GatewayClient.js");
const SecretConfig = require("../../Configs/Secrets.json");
const MainConfig = require("../../Configs/Config.json");
const GatewayClientConfig = require("../../Configs/GatewayClient.json");

/**
 * Wrapper function for initiating GatewayClient
 * @param {object} Config
 * @returns {import("./Structures/GatewayClient.js")} GatewayClient
 */
module.exports = async (Config = Object.assign(GatewayClientConfig, MainConfig, SecretConfig)) => {
    const Gateway = new GatewayClient(Config);
    Gateway.start();
    Config.debug.init ? console.log("Gateway : started") : undefined;
    return Gateway;
};