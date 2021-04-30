// JavaScript source code main entry point
const Code = require("./Code.js");
const Gateway = require("./Gateway.js");
const Cache = require("./Cache.js");

const AmqpClient = new (require("./amqp/AmqpClient.js"))(require("./Configs/Config.json").amqp);

(async () => {
    await AmqpClient.start();
    Code(undefined, AmqpClient);
    Cache(undefined, AmqpClient);
    Gateway(undefined, AmqpClient);
})().catch(console.error);