var NA=require("nodealytics");NA.initialize("UA-48103058-1","catjsteam.github.io",function(){}),exports.updateAnalytics=function(n){var i=require("child_process").exec,t=i("npm config get proxy");t.stdout.on("data",function(i){if(0===i.indexOf("null")){var t=n.task?n.task.join(", "):"undefined_task",a=n.argv&&n.argv.original?n.argv.original.join(", "):"undefined_args";NA.trackEvent("CAT",a,t,function(n,i){!n&&i&&200===i.statusCode&&console.log("Thank you for contribute to CAT analytics")})}})};