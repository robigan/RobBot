/**
 * GatewayClient, the entrypoint for initiating a gateway client
 * @module gateway/client
 */

const CloudStorm = require("cloudstorm");

module.exports = class GatewayClient extends CloudStorm {
    /**
     * Initiate the gateway service for RobBot
     * @constructor
     * @param {object} Config
     * @param {import("../../amqp/AmqpClient")} AmqpClient 
     */
    constructor(Config, AmqpClient) {
        super(Config.token, Config.CloudStorm);
        const Channel = AmqpClient.initQueue(Config.amqp.queueGatewayCache);
        Channel.sendToQueue(Config.amqp.queueGatewayCache, new Buffer("Hello World"));
        //this.AmqpConnection.on("error", async (e) => console.error(e));
    }
};