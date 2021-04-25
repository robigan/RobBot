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
        this.Config = Config;
        this.Interface = this.Config.amqp.queueGatewayCache;
        this.AmqpClient = AmqpClient;
        //this.AmqpConnection.on("error", async (e) => console.error(e));
    }

    async start() {
        this.Channel = await this.AmqpClient.initQueue(this.Interface);
        this.Channel.sendToQueue(this.Interface, Buffer.from("Hello World"));
    }
};