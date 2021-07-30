const Config = Object.assign((require("./manifest.json")).config, require("./secrets.json"));
module.exports = Config;