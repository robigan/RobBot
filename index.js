// JavaScript source code
const RobiClient = require("./Code/Structures/RobiClient.js");
const SecretConfig = require("./Configs/Secrets.json");
const Config = require("./Configs/Config.json");

const Client = new RobiClient(Object.assign(Config, SecretConfig));
Client.start();

//This was built on MenuDocs tutorial and I plan to use it as my framework
//Also just like in the tutorial I needed to install util cus apparently there were some issues
//Oh hey u got to do the bottom :D, slight refrence; 
//I use single quotes for "special text", dbl quotes for sentences, and backticks for concat/shit 