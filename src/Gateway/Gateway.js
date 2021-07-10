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
 * @param {import("../amqp/AmqpClient")} AmqpClient
 * @returns {import("./Structures/GatewayClient.js")} GatewayClient
 */
module.exports = async (Config = Object.assign(GatewayClientConfig, MainConfig, SecretConfig), AmqpClient = new (require("../amqp/AmqpClient.js"))(MainConfig.amqp)/*, LocResProvided = require("./LocationResolver.js")*/) => {
    //global.LocRes = LocResProvided;
    const Gateway = new GatewayClient(Config, AmqpClient);
    Gateway.start();
    Config.debug.init ? console.log("Gateway : started") : undefined;
    return Gateway;
};