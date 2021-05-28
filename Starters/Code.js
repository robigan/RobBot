/**
 * RobiClient wrapper. Makes initiating the RobiClient easier
 */

const RobiClient = require("../src/Code/Structures/RobiClient.js");
const SecretConfig = require("../Configs/Secrets.json");
const MainConfig = require("../Configs/Config.json");
const RobiClientConfig = require("../Configs/RobiClient.json");

/**
 * Wrapper function for initiating RobiClient
 * @param {object} Config
 * @param {import("../src/amqp/AmqpClient")} AmqpClient
 * @returns {import("../src/Code/Structures/RobiClient")} RobiClient
 */
module.exports = async (Config = Object.assign(RobiClientConfig, MainConfig, SecretConfig), AmqpClient = new (require("../src/amqp/AmqpClient.js"))(MainConfig.amqp)) => {
    const Code = new RobiClient(Config, AmqpClient);
    await Code.start();
    Config.debug.init ? console.log("Code    : started") : undefined;
    return Code;
};