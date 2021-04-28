/**
 * RobiClient wrapper. Makes initiating the RobiClient easier
 */

const RobiClient = require("./Code/Structures/RobiClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const MainConfig = require("./Configs/Config.json");
const RobiClientConfig = require("./Configs/RobiClient.json");

/**
 * 
 * @param {object} Config
 * @param {import("./amqp/AmqpClient")} AmqpClient 
 * @returns {*} RobiClient
 */
module.exports = async (Config = Object.assign(RobiClientConfig, MainConfig, SecretConfig), AmqpClient) => {
    const Code = new RobiClient(Config, AmqpClient);
    await Code.start();
    return Code;
};