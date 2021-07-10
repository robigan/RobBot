/**
 * RobiClient wrapper. Makes initiating the RobiClient easier
 */

const RobiClient = require("./Structures/RobiClient.js");
const SecretConfig = require("../../Configs/Secrets.json");
const MainConfig = require("../../Configs/Config.json");
const RobiClientConfig = require("../../Configs/RobiClient.json");

/**
 * Wrapper function for initiating RobiClient
 * @param {object} Config
 * @param {import("../amqp/AmqpClient")} AmqpClient
 * @returns {import("./Structures/RobiClient")} RobiClient
 */
module.exports = async (Config = Object.assign(RobiClientConfig, MainConfig, SecretConfig), AmqpClient = new (require("../amqp/AmqpClient.js"))(MainConfig.amqp)/*, LocResProvided = require("./LocationResolver.js")*/) => {
    //global.LocRes = LocResProvided;
    const Code = new RobiClient(Config, AmqpClient);
    await Code.start();
    Config.debug.init ? console.log("Code    : started") : undefined;
    return Code;
};