_cat.utils.assert = function () {


    function _sendTestResult(data) {

        var config = _cat.core.getConfig();

        if (config) {
            _cat.utils.AJAX.sendRequestSync({
                url: _cat.core.TestManager.generateAssertCall(config, data)
            });
        }
    }

    return {

        /**
         * Send assert message to the UI and/or to catjs server
         *
         * @param config
         *      name {String} The test name
         *      displayName {String} The test display name
         *      status {String} The status of the test (success | failure)
         *      message {String} The assert message
         *      success {Boolean} Whether the test succeeded or not
         *      ui {Boolean} Display the assert data in catjs UI
         *      send {Boolean} Send the assert data to the server
         */
        create: function (config) {

            if (!config) {
                return;
            }

            var testdata;

            if (config.status && config.message && config.name && config.displayName) {


                testdata = _cat.core.TestManager.addTestData({
                    name: config.name,
                    type: config.type,
                    displayName: config.displayName,
                    status: config.status,
                    message: config.message,
                    success: (("success" in config && config.success) ? true : false), 
                    reportFormats: config.send

                });

                if (config.ui) {
                    _cat.core.ui.setContent({
                        style: ( (testdata.getStatus() === "success") ? "color:green" : "color:red" ),
                        header: testdata.getDisplayName(),
                        desc: testdata.getMessage(),
                        tips: _cat.core.TestManager.getTestSucceededCount(),
                        elementType : ( (testdata.getStatus() === "success") ? "listImageCheck" : "listImageCross" )
                    });
                }

                // TODO parse report formats : consider api for getConsole; getJUnit ...
                if (config.send) {
                    _sendTestResult(testdata);
                }
            }
        }

    };

}();