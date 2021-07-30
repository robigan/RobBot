/**
 * GatewayClient, the entrypoint for initiating a gateway client
 * @module gateway/client
 */

const CloudStorm = require("cloudstorm");
const Config = Object.assign(require("./manifest.json").config, require(global.robbotInstances.get("robigan.config").modulePath));

/**
 * GatewayClient class
 * @extends {import("cloudstorm")}
 */
class GatewayClient extends CloudStorm {
    /**
     * Initiate the gateway service for RobBot
     * @constructor
     * @param {object} Config
     */
    constructor(Config) {
        super(Config.token, Config.CloudStorm);
        this.Config = Config;
        this.Interface = this.Config.amqp.queueGatewayCache;
        this.AmqpClient = global.robbotAmqpClient;

        super.on("error", console.error);

        this.Config.debug.gateway ? super.on("debug", console.warn) : undefined;

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
            this.Channel.sendToQueue(this.Interface, Buffer.from(JSON.stringify(Object.assign(event, {
                "stats": {
                    "gatewayPID": process.pid
                }
            }))));
        });
    }
}

GatewayClient.start();
Config.debug.init ? console.log("Gateway : started") : undefined;