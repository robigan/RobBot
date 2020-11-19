const PathM = require("path");
const { stat: fsStat} = require("fs").promises;
const Glob = require("glob-promise");

module.exports = class LocRes {
    get indexDir() {
        return PathM.dirname(PathM.join(process.cwd(), "functions"));
    }

    redirect(location, fileS = "posix") {
        fileS = fileS.toLowerCase();
        const Path = fileS === "posix" ? PathM.posix : fileS === ("win32" || "nt") ? PathM.win32 : PathM;
        return Path.normalize(Path.join(this.indexDir, location)); //Joins index.js's absolute and normalizes it
    }

    async glob(Path) {
        return await Glob(Path); 
    } //Note that Glob here has been promisified

    async validate(location, flag = "file") {
        return await fsStat(location, (err, stat) => {
            if (err === null) {
                return stat.isDirectory() && flag === "directory" ? true : flag === "file" && stat.isFile() ? true : flag === "all" ? true : false;
            } else if (err.code === "ENOENT") {
                return false;
            } else {
                console.error("LocRes error whilst validating: ", err.code);
            }
        });
    }
};