/**
 * CacheClient wrapper. Makes initiating the CacheClient, and connecting to redis easier
 */

const CacheClient = require("./Gateway/CacheClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const MainConfig = require("./Configs/Config.json");
const CacheClientConfig = require("./Configs/CacheClient.json");

/**
 * Wrapper function for initiating CacheClient
 * @param {object} Config
 * @param {import("./amqp/AmqpClient")} AmqpClient
 * @returns {import("./Cache/CacheClient")} CacheClient
 */
module.exports = async (Config = Object.assign(CacheClientConfig, MainConfig, SecretConfig), AmqpClient = new (require("./amqp/AmqpClient.js"))(MainConfig.amqp)/*, LocResProvided = require("./LocationResolver.js")*/) => {
    //global.LocRes = LocResProvided;
    const Cache = new CacheClient(Config, AmqpClient);
    //await Cache.start();
    return Cache;
};