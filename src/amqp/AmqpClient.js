/**
 * AmqpClient, gives specific functions for use with RobBot
 * @module amqp/client
 */

const amqp = require("amqplib-plus");

/**
 * AmqpClient class
 * @extends {import("amqplib-plus").Connection}
 */
module.exports = class AmqpClient extends amqp.Connection {
    /**
     * Initiate the amqp Connection class
     * @constructor
     * @param {import("../Configs/Config.json").amqp} Configuration
     */
    constructor(Config) {
        super(Config.connection);
        this.Config = Config;
    }

    /**
     * Start a connection to the amqp server
     * @async
     * @function
     */
    async start() {
        await super.connect();
    }

    /**
     * Initiate a queue
     * @async
     * @function
     * @param {string} Interface 
     * @param {object} Options 
     * @returns {import("@types/amqplib/index").Channel} Channel
     */
    async initQueue(Interface, Options = { durable: false, autoDelete: true }) {
        const channel = await super.createChannel(async (ch) => {
            await ch.assertQueue(Interface, Options);
        });
        return channel;
    }

    /**
     * Initiate a queue and the consume it
     * @async
     * @function
     * @param {string} Interface 
     * @param {object} QueueOptions 
     * @param {function(event, ch)} Handler 
     * @param {object} ConsumeOptions 
     * @returns {import("@types/amqplib/index").Channel} Channel
     */
    async initQueueAndConsume(Interface, QueueOptions, Handler, ConsumeOptions) {
        const channel = await this.initQueue(Interface, QueueOptions);
        channel.consume(Interface, (event) => {
            Handler(event, channel);
        }, ConsumeOptions);
        return channel;
    }
};