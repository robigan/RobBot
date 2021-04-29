const BaseConnector = require("raincache/dist/connector/BaseConnector.js");

module.exports = class CustomConnector extends BaseConnector {
    /**
     * 
     * @param {import("../../amqp/AmqpClient")} AmqpClient 
     * @param {object} Amqp 
     */
    constructor(AmqpClient, Amqp) {
        super();
        this.options = Amqp;
        this.client = AmqpClient;
        this.channel = null;
        this.ready = false;
    }

    async initialize() {
        this.channel = await this.client.initQueue(this.options.queueCacheCode);
        await this.client.initQueueAndConsume(this.options.queueGatewayCache, undefined, async (event, ch) => {
            this.emit("event", JSON.parse(event.content.toString()));
            ch.ack(event);
        });
        this.ready = true;
    }

    async send(event) {
        this.channel.sendToQueue(this.options.queueCacheCode, Buffer.from(JSON.stringify(event)));
    }
};