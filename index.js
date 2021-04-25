// JavaScript source code main entry point
//const Code = require("./Code.js");
const Gateway = require("./Gateway.js");

const AmqpClient = new (require("./amqp/AmqpClient.js"))(require("./Configs/Config.json").amqp);

(async () => {
    await AmqpClient.start();
    //Start(Code);
    Gateway(undefined, AmqpClient);
})().catch(console.error);