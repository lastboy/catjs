var _typedas = require("typedas"),
    _log = catrequire("cat.global").log(),
    _regutils = catrequire("cat.regexp.utils");

module.exports = function() {

    return {

        /**
         * Extract single Scrap e.g [@@foo value]
         *
         * @param row
         * @returns {{key: *, value: *}}
         */
        extractSingle: function(row) {

            var configKey,
                configVal,
                singleRow;

            singleRow = _regutils.getMatch(row, "@@(.*?\\[[\\s]+)(.*)");
            if (!singleRow) {
                singleRow = _regutils.getMatch(row, "@@(.*?[\\s]+)(.*)");
            } else {
                singleRow = null;
            }

            if (singleRow) {

                // single row annotation expression
                configKey = singleRow[1];
                configVal = singleRow[2];

            } else {
                _log.warn("[SCRAP Utils] failed to parse row: '" + row + "'");
            }

            return {key: configKey, value: configVal};
        },

        putScrapConfig: function(config, configKey, configVal, idx) {
                
            if (configKey) {
                configKey = configKey.trim();
                if (!config[configKey]) {
                    if (_typedas.isArray(configVal)) {
                        config[configKey] = configVal;
                    } else {
                        config[configKey] = [configVal];
                    }
                    
                    config.stack.push({ key: configKey, cell: (config[configKey] ? config[configKey].length-1 : 0) })
                } else {
                    if (_typedas.isArray(configVal)) {
                        config[configKey] = config[configKey].concat(configVal);
                    } else {
                        config[configKey].push(configVal);
                    }
                    config.stack.push({ key: configKey, cell: config[configKey].length-1})
                }
            }

        },

        /**
         * Collect the row data out of the given collection
         *
         * @param collection The Array of data collection
         * @returns {Array} The data array
         */
        collectDataConfig: function(collection) {
            var data = [],
                idxi= 0, sizei= 0, itemi,
                // 0-don't push, 1-push data, 2-push data and break
                pushdata = 0,
                me = this;

            data = [];
            pushdata = false;
            sizei = collection.length;
            for (idxi=0; idxi<sizei; idxi++) {
                itemi = collection[idxi];
                if (itemi) {

                    if (itemi === "[") {
                        pushdata = 1;
                    } else if (itemi === "]") {
                        pushdata = 2;
                    }

                    if (pushdata) {
                        if (itemi) {
                            if (_typedas.isString(itemi)) {
                                itemi = me.cleanDataNoise(itemi);
                            }
                            data.push(itemi);
                        }
                        if (pushdata === 2) {
                            break;
                        }
                    }
                }
            }

            return data;
        },

        /**
         *
         * @param collection
         */
        normalizeData: function(collection) {
            var data=[],
                collectionl,
                me = this;
            if (collection && collection.length > 0) {
                collectionl = collection.splice(1);
                collectionl.forEach(function(item) {
                    if (item) {
                        if (_typedas.isString(item)) {
                            item = me.cleanDataNoise(item);
                        }
                        if (item){
                            data.push(item);
                        }
                    }
                });
            }
            return data;
        },

        /**
         * Clean data noise such as carrige return or other junk.
         *
         * @param str The given string data
         * @returns {*} the filtered data
         */
        cleanDataNoise: function(str) {
            if (str) {
                str = str.trim();
                str = str.replace(/[\n\r]+/g, "");
            }
            return str;
        },

        /**
         * Clean empty string cells
         *
         */
        cleanArray: function(collection) {
            var data = [];
            if (collection) {
                collection.forEach(function(item) {
                    if (item) {
                        data.push(item);
                    }
                });
            }
            return data;
        },

        /**
         * Take care of apostrophes commas and such
         *
         * @param collection
         * @returns {Array}
         */
        parseData: function(collection) {
            var data = [],
                bracketsTest = new RegExp(/[\[\]]+/g),
                counter = 0, size;

            function addapostrophe(str) {
                if (str) {
                    str = str.split('"').join("\\\"");
                    return ["",str,""].join("\"");
                }
                return str;
            }

            if (collection) {
                size = collection.length-2;
                collection.forEach(function(item) {
                    if (item && !bracketsTest.test(item))  {
                        item = addapostrophe(item);
                        if (counter<size-1) {
                            item += ",";
                        }
                        counter++;
                    }
                    data.push(item);
                });
            }
            return data;
        }
    };

}();