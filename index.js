// JavaScript source code main entry point
const Code = require("./Starters/Code.js");
const Gateway = require("./Starters/Gateway.js");
const Cache = require("./Starters/Cache.js");

const AmqpClient = new (require("./src/amqp/AmqpClient.js"))(require("./Configs/Config.json").amqp);

(async () => {
    await AmqpClient.start();
    Code(undefined, AmqpClient);
    Cache(undefined, AmqpClient);
    Gateway(undefined, AmqpClient);
})().catch(console.error);