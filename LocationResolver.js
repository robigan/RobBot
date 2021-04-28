/**
 * LocationResolver, a module for resolving certain filepaths
 * @module LocRes
 */

const PathM = require("path");
const { stat: fsStat} = require("fs").promises;
const Glob = require("glob-promise");

/**
 * LocRes class
 * @constructor
 */
module.exports = class LocRes {
    /**
     * @description returns 
     * @property
     * @static
     * @returns {string} Process cwd
     */
    static get indexDir() {
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
    static async redirect(location, fileS = "posix") {
        fileS = fileS.toLowerCase();
        const Path = fileS === "posix" ? PathM.posix : fileS === ("win32" || "nt") ? PathM.win32 : PathM;
        return Path.normalize(Path.join(this.indexDir, location)); //Joins index.js's absolute and normalizes it
    }

    /**
     * @static
     * @async
     * @param {string} Path 
     * @returns {Promise}
     */
    static async glob(Path) {
        return Glob(Path); 
    } //Note that Glob here has been promisified

    static async validate(location, flag = "file") {
        return fsStat(location, (err, stat) => {
            if (err === null) {
                return stat.isDirectory() && flag === "directory" ? true : flag === "file" && stat.isFile() ? true : flag === "all" ? true : false;
            } else if (err.code === "ENOENT") {
                return false;
            } else {
                console.error("LocRes error whilst validating: ", err.code);
                return false;
            }
        });
    }
};