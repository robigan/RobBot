/**
 * AmqpClient, gives specific functions for use with RobBot
 * @module amqp/client
 */

const amqp = require("amqplib-plus");

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
     * Initiate a channel
     * @async
     * @function
     * @returns {} Channel
     */
    async initChannel() {
        const channel = await super.createChannel();
        return channel;
    }

    /**
     * Initiate a queue
     * @async
     * @function
     * @param {string} Interface 
     * @param {object} Options 
     * @returns {} Channel
     */
    async initQueue(Interface, Options) {
        const channel = await this.initChannel();
        channel.assertQueue(Interface, Options);
        return channel;
    }
};