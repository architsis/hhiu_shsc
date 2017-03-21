var express = require('express');
var crontab = require('node-crontab');
var device_controller = require('./deviceController.js');



//exports.notification = function (req, res) {
var jobId = crontab.scheduleJob("* * * * *", function () {
 
  device_controller.nightModeNotification(function (endpoint) {

                                           

                   });
console.log("one minute");
});
//}
