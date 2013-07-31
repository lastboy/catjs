var _ = require("underscore"),
    _fs = require("fs.extra"),
    _typedas = require("typedas"),
    _log = catrequire("cat.global").log();

// underscore settings for like mustache parametrization style {{foo}}
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

module.exports = function () {

        /**
         * Synchronized process for creating folder recursively
         */
            _mkdirSync = function (folder) {
            if (!_fs.existsSync(folder)) {
                try {
                    _fs.mkdirRecursiveSync(folder);
                    _log.debug("[copy action] target folder was created: " + folder);

                } catch (e) {
                    _log.error("[copy action] failed to create target dir: " + folder);
                    throw e;
                }
            }
        },

        /**
         * Copy file synchronized
         */
            _copySync = function (source, target, cb) {
            var cbCalled = false;

            var rd = _fs.createReadStream(source);
            rd.on("error", function (err) {
                done(err);
            });
            var wr = _fs.createWriteStream(target);
            wr.on("error", function (err) {
                done(err);
            });
            wr.on("close", function (ex) {
                done();
            });
            rd.pipe(wr);

            function done(err) {
                if (!cbCalled) {
                    if (cb) {
                        cb(err);
                    }
                    cbCalled = true;
                }
            }
        };

    return {

        mkdirSync: _mkdirSync,

        copySync: _copySync,

        error: function (msg) {
            _log.error(msg);
            throw msg;
        },

        getRelativePath: function (file, basePath) {
            return ((file && basePath) ? file.substring(basePath.length) : undefined);
        },

        /**
         *  Check if a given object contains a value
         *
         * @param obj The object that might contains
         * @param value The value to be searched
         *
         * @returns {boolean} If the value contains in the obj return true else return false
         */
        contains: function (obj, value) {
            var key;

            if (obj) {
                for (key in obj) {
                    if (obj[key] === value) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * Copy the source object's properties.
         * TODO TBD make it more robust, recursion and function support
         *
         * @param srcObj
         * @param destObj
         * @param override Override existing property [false as default]
         */
        copyObjProps: function (srcObj, destObj, override) {

            var name, obj;

            override = (override || false);

            if (srcObj && destObj) {
                for (name in srcObj) {
                    if (srcObj.hasOwnProperty(name)) {
                        obj = destObj[name];
                        if (!obj) {
                            destObj[name] = srcObj[name];
                        } else {
                            if (srcObj[name] instanceof Object) {
                                arguments.callee(srcObj[name], destObj[name], override);
                            } else {
                                if (override || obj === undefined) {
                                    destObj[name] = srcObj[name];
                                }
                            }
                        }
                    }
                }
            }
        },

        forEachProp: function (srcObj, callback) {
            var name;

            if (srcObj) {
                for (name in srcObj) {
                    if (srcObj.hasOwnProperty(name)) {
                        if (callback) {
                            callback.call(srcObj, name);
                        }
                    }
                    else {

                    }
                }
            }
        },

        kill: function (pids, excludes) {
            var me = this;

            if (pids) {
                pids.forEach(function (pid) {
                    if (excludes) {
                        excludes.forEach(function (exclude) {
                            if (pid != exclude) {
                                try {
                                    process.kill(pid, "SIGKILL");

                                } catch (e) {
                                    // TODO check if the process is running
                                    _log.error("[kill process] failed to kill pid: " + pid + "; The process might not exists");
                                }
                            }
                        });
                    }
                });
            }
        },

        underscore: _,

        /**
         * Load template file content
         *
         * @param name The name of the template
         * @param folder The subject folder
         * @returns {*}
         */
        readTemplateFile: function (name, folder) {
            var content,
                file = [cathome, "src/template", folder, name].join("/");

            try {
                content = _fs.readFileSync([file, "tpl"].join("."), "utf8");

            } catch (e) {
                _log.warning(_props.get("cat.file.failed").format("[inject ext]", file, e));
            }

            return content;
        },

        /**
         * Load and compile template with underscore
         *
         * @param config The params:
         *      file The file path to be loaded (see underscore template)
         *      data The data object properties (see underscore template)
         *      settings The setting arguments (see underscore template)
         */
        template: function(file, data, settings){
            //this._.template
        }
    }

}();