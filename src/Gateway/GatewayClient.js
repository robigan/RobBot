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
     * @param {import("../amqp/AmqpClient")} AmqpClient
     */
    constructor(Config, AmqpClient) {
        super(Config.token, Config.CloudStorm);
        this.Config = Config;
        this.Interface = this.Config.amqp.queueGatewayCache;
        this.AmqpClient = AmqpClient;

        super.on("error", console.error);

        super.once("ready", async () => {
            console.log("Gateway : Logged in!");
        });
    }

    /**
     * Start function
     * @async
     * @function
     */
    async start() {
        this.Channel = await this.AmqpClient.initQueue(this.Interface);
        //this.Channel.sendToQueue(this.Interface, Buffer.from("Hello World"));
        super.connect();

        super.on("event", async (event) => {
            this.Channel.sendToQueue(this.Interface, Buffer.from(JSON.stringify(event)));
        });
    }
};