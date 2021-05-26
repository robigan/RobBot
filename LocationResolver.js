/**
 * LocationResolver, a module for resolving certain filepaths
 * @module LocRes
 */

const PathM = require("path");
const { stat: fsStat } = require("fs").promises;
const Glob = require("glob-promise");

/**
 * LocRes class
 * @constructor
 */
module.exports = class LocRes {
    /**
     * @constructor
     * @param {Array} Config
     */
    constructor(Config = [
        {
            "Path": "/Modules/Code",
            "Resolve": "/src/Code/Modules"
        }
    ]) {
        this.Config = Config;
        this.Path = PathM;
        this.Glob = Glob;
    }

    /**
     * @description returns 
     * @static
     * @returns {string} Process cwd
     */
    get indexDir() {
        return process.cwd();
    }

    /**
     * Get's the full path starting from process cwd
     * @static
     * @async
     * @param {string} location 
     * @param {string} file system type
     * @returns {string} full path
     */
    async redirect(location, fileS = "posix") {
        fileS = fileS.toLowerCase();
        const Path = fileS === "posix" ? PathM.posix : fileS === ("win32" || "nt") ? PathM.win32 : PathM;
        for (const Resolve of this.Config) {
            location.startsWith(Resolve.Path) ? location = (Resolve.Resolve + location.slice(Resolve.Path.length)) : undefined;
        }
        return Path.normalize(Path.join(this.indexDir, location)); //Joins index.js's absolute and normalizes it
    }

    /**
     * @static
     * @async
     * @param {string} Path 
     * @returns {Promise}
     */
    async glob(Path) {
        return Glob(Path);
    } //Note that Glob here has been promisified

    /**
     * Validate if a file/directory exists
     * @param {string} location 
     * @param {string} flag 
     * @returns 
     */
    async validate(location, flag = "file") {
        const stat = await fsStat(location).catch(err => {
            if (!(err.code === "ENOENT")) console.error("LocRes error whilst validating:", err.code);
        });
        return stat ? stat.isDirectory() && flag === "directory" ? true : flag === "file" && stat.isFile() ? true : flag === "all" ? true : false : false;
    }
};