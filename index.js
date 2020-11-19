// JavaScript source code
//const LocRes = new (require("./Structures/LocationResolver"));
const RobiClient = require("./Structures/RobiClient.js");
const Config = require("./Modules/Configs/Secrets.json");

const Client = new RobiClient(Config);
Client.start();

//This was built on MenuDocs tutorial and I plan to use it as my framework
//Also just like in the tutorial I needed to install util cus apparently there were some issues
//Oh hey u got to do the bottom :D, slight refrence; 
//I use single quotes for "special text", dbl quotes for sentences, and backticks for concat/shit 