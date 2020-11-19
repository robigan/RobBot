const Path = require('path');
const { promisify } = require('util');
const Glob = promisify(require('glob-promise'));
const Command = require('./Command.js');

module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    isClass(input) {
        return typeof input === 'function' && typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        return `${Path.dirname(require.main.filename)}`;
    }

    async loadCommands() {
        return Glob(`${this.directory}/Commands/**/*.js`).then((commands) => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = Path.parse(commandFile);
                const File = require(commandFile)
                if (!this.isClass(File)) console.error(`Command ${name} doesn't export a class`);
                const command = new File(this.client, name.toLowerCase()).catch((err) => {
                    console.error(`Command ${name} has had an error, not implementing...`);
                    console.error(err);
                    continue;
                });
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn\'t belong in Commands`);
                if (this.client.commands.get(command.name)) throw new SyntaxError(`Command ${command.name} has already been defined, please rename it to something else`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        if (this.client.aliases.get(alias.toLowerCase())) throw new SyntaxError(`Alias ${alias} has already been defined, please rename ${command.name} to something else`);
                        this.client.aliases.set(alias.toLowerCase(), command.name);
                    }
                }
            }
        });
    }

	displayRoles(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		} else if(arr.length < maxLen) {
            arr.join(', ');
        }
		return arr;
    }
    
    
}