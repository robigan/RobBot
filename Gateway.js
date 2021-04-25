/**
 * GatewayClient wrapper. Makes initiating the GatewayClient easier
 */

const GatewayClient = require("./Gateway/Structures/GatewayClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const MainConfig = require("./Configs/Config.json");
const GatewayClientConfig = require("./Configs/GatewayClient.json");

/**
 * Wrapper function for initiating GatewayClient
 * @param {object} Config
 * @param {import("./amqp/AmqpClient")} AmqpClient 
 * @returns {import("./Gateway/Structures/GatewayClient")} GatewayClient
 */
module.exports = async (Config = Object.assign(GatewayClientConfig, MainConfig, SecretConfig), AmqpClient) => {
    const Gateway = new GatewayClient(Config, AmqpClient);
    await Gateway.start();
    return Gateway;
};