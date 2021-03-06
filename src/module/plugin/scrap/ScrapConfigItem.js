/**
 * Scrap configuration item class
 * properties:
 *      value - the config value
 *      sign - the sign value ('!' '=')
 *
 * @type {module.exports}
 */

var _typedas = require("typedas");

module.exports = function () {


    function ScrapConfigItem(config) {

        this.$$classType = "ScrapConfigItem";
        if (config) {
            this.config = config;
        }

    }

    ScrapConfigItem.prototype.get = function(key) {
        return (this.config ? this.config[key] : undefined);
    };

    ScrapConfigItem.prototype.getValue = function() {
        return this.get("value");
    };

    ScrapConfigItem.prototype.getSign = function() {
        return this.get("sign");
    };

    return {

        create: function(config) {
            return (new ScrapConfigItem(config));
        },

        instanceOf: function(obj) {
            return  (obj && _typedas.isObject(obj) && ("$$classType" in obj) && obj["$$classType"] ? true : false);
        }

    };

}();