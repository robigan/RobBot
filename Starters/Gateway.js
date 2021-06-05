/**
 * GatewayClient wrapper. Makes initiating the GatewayClient easier
 */

const GatewayClient = require("../src/Gateway/GatewayClient.js");
const SecretConfig = require("../Configs/Secrets.json");
const MainConfig = require("../Configs/Config.json");
const GatewayClientConfig = require("../Configs/GatewayClient.json");

/**
 * Wrapper function for initiating GatewayClient
 * @param {object} Config
 * @param {import("../src/amqp/AmqpClient")} AmqpClient
 * @returns {import("../src/Gateway/GatewayClient")} GatewayClient
 */
module.exports = async (Config = Object.assign(GatewayClientConfig, MainConfig, SecretConfig), AmqpClient = new (require("../src/amqp/AmqpClient.js"))(MainConfig.amqp)/*, LocResProvided = require("./LocationResolver.js")*/) => {
    //global.LocRes = LocResProvided;
    const Gateway = new GatewayClient(Config, AmqpClient);
    Gateway.start();
    Config.debug.init ? console.log("Gateway : started") : undefined;
    return Gateway;
};