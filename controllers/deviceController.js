var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helper = require('../common/helper');
var deviceModel = require('../models/deviceModel');
var config = require('../config');
var jwt = require('jsonwebtoken');
var userModel = require('../models/userModel');
var language = require('../common/language');
var AWS = require('aws-sdk');
var crontab = require('node-crontab');
var sns = new AWS.SNS({accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.snsEndpoint,
    region: config.region
});


/********************************************************************************
 ** Function            : addNetwork
 ** Description         : With this Api user can add the network for the device
 ** Input Parameters    : networkname, lat long
 ** Return Values       : status:-{True or False},data:-{Network is added, Network name should be unique}
 ********************************************************************************/

exports.addNetwork = function (req, res) {
    var auth_token = req.headers.authorization;
    var lat = req.body.lat;
    var long = req.body.long;
    var user_id = req.body.user_id;
    var network_name = req.body.network_name;
    var network_address = req.body.network_address;

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response == 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    console.log(err);
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);
                } else {
                    var date = new Date();
                    deviceModel.fetchingDetails(user_id, function (result) {
                        if (result.length > 0) {
                            var user_token = result[0].user_token;
                            var timestamp = date.getTime(); // current timestamp
                            var random_number = helper.randomNumber(); //generate random string from device token
                            var post_data = {
                                network_name: network_name,
                                network_lat: lat,
                                network_long: long,
                                network_created_by: user_token,
                                network_created_on: timestamp,
                                user_id_fk: user_id,
                                network_address: network_address
                            };
                            deviceModel.checkNetworkExist(post_data, function (result) {
                                if (result > 0) {
                                    var status = false;
                                    var resp_code = "7";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
                                } else {
                                    deviceModel.registerNetwork(post_data, function (result) {
                                        var network_id = result.insertId;
                                        var network_token = 'nt_' + network_id + '_' + random_number;
                                        deviceModel.updateNetworkToken(network_id, network_token, function (result) {
                                            var network_role_data = {
                                                user_token: user_token,
                                                user_role: "sa",
                                                network_token: network_token,
                                                user_created_on: timestamp,
                                                user_network_status: 1,
                                                network_id_fk: network_id
                                            };
                                            deviceModel.insertRole(network_role_data, function (result) {
                                                var status = true;
                                                var resp_code = "16";
                                                var message = language.getResponse(resp_code);
                                                var response = helper.sendResult(status, message);
                                                res.send(response);
                                            });
                                        });
                                    });
                                }
                            });
                        } else {
                            var status = false;
                            var resp_code = "9";
                            var message = language.getResponse(resp_code);
                            var response = helper.sendResult(status, message);
                            res.send(response);
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

/********************************************************************************
 ** Function            : adddevice
 ** Description         : With this Api user can add the device in the particular network
 ** Input Parameters    : device_active_status ,network_token,device_ip ,network_id_fk
 ** Return Values       : status:-{True or False},data:-{Device is added successfully, }
 ********************************************************************************/

exports.addDevice = function (req, res) {
    var user_id = req.body.user_id;
    var device_name = req.body.device_name;
    var device_mac = req.body.device_mac;
    var serial_no = req.body.serial_no;
    var date = new Date();
    var timestamp = date.getTime();
    var network_token = req.body.network_token;
    var network_id = req.body.network_id;
    var auth_token = req.headers.authorization;
    var device_default_mode = 'home';

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response == 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);
                } else {
                    var set_data = {
                        device_name: device_name,
                        device_mac: device_mac,
                        network_token: network_token,
                        created_on_date: timestamp,
                        network_id_fk: network_id,
                        device_serial_no: serial_no,
                        device_active_mode: device_default_mode,
                        device_active_status: "1",
                        battery_status: "100",
                        night_mode: "0",
                        privacy_mode: "0",
                        home_mode: "0"
                    };
                    deviceModel.vaildateDeviceMac(device_mac, serial_no, function (response) {
                        if (response.length > 0) {
                            var status = false;
                            var resp_code = "17";
                            var message = language.getResponse(resp_code);
                            var response = helper.sendResult(status, message);
                            res.send(response);
                        } else {
                            //  inserting data in device table
                            deviceModel.registerDevice(set_data, function (result) {
                                var random_number = helper.randomNumber();
                                var device_id = result.insertId;
                                var device_token = 'dv_' + device_id + '_' + random_number;
                                deviceModel.updateDeviceToken(device_id, device_token, function (result) {
                                    var status = true;
                                    var resp_code = "18";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
                                });
                            });
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

/********************************************************************************
 ** Function            : recordingList
 ** Description         : With this Api user can fetch all the user's recording
 ** Input Parameters    : network token ,user_id,user_role 
 ** Return Values       : status:-{True or False},data:-{ {"status":true,
 *                        "data":[{"device_token":"dv_106_Nnoo",
 *                        "recordings":[{"date":"1484818152666",
 *                        "video":"Demand_2017-1-27_15-18-23.mp4.enc",
 *                        "snapshots":["Demand_2017-1-27_15-18-24.jpg.enc"],
 *                        "key":"CB3926FDA83F4BB340FCBAFBACF68869",
 *                        "iv":"3BC01F904A22463357B06370DE970870"}}}
 ********************************************************************************/

exports.recordingList = function (req, res) {
    var network_token = req.body.network_token;
    var user_id = req.body.user_id;
    var user_role = req.body.user_role;
    var auth_token = req.headers.authorization;
    var arr = [];

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response === 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);
                } else {
                    userModel.getUserTokenUserTable(user_id, function (response) {
                        if (response.length > 0) {
                            if (user_role === "sa" || user_role === "a") {
                                deviceModel.fetchRecordingList(network_token, function (response) {
                                    var arr = fetchRecording(response);
                                    if (arr) {
                                        var status = true;
                                        var response = helper.sendResult(status, arr);
                                        res.send(response);
                                    }
                                });
                            } else if (user_role === "u") {
                                deviceModel.fetchRecordingListUser(network_token, function (response) {
                                    var arr = fetchRecording(response);
                                    if (arr) {
                                        var status = true;
                                        var response = helper.sendResult(status, arr);
                                        res.send(response);
                                    }
                                });
                            }
                        } else {
                            var status = false;
                            var resp_code = "9";
                            var message = language.getResponse(resp_code);
                            var response = helper.sendResult(status, message);
                            res.send(response);
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

fetchRecording = function (response) {
    var master_arr = [];
    var snapshots = [];
    var k = 0;
    for (var i = 0; i < response.length; i++) {
        var device_token = response[i].device_token_fk;
        var date = response[i].created_on;
        var key = response[i].recording_decryption_key;
        var iv = response[i].recording_iv;
        var video = response[i].recording_name;
        var snapshots = response[i].snapshots;
        var snap = JSON.parse(snapshots);

        for (var j = 0; j < master_arr.length; j++) {
            if (response[i].device_token_fk === master_arr[j].device_token) {
                var sub_data = {
                    date: date,
                    video: video,
                    snapshots: snap,
                    key: key,
                    iv: iv
                };
                master_arr[j].recordings.push(sub_data);
                k++;
                break;
            }
            k = 0;
        }
        if (k === 0) {
            var data = {
                device_token: device_token,
                recordings: [{
                        date: date,
                        video: video,
                        snapshots: snap,
                        key: key,
                        iv: iv
                    }]
            };
            master_arr.push(data);
        }
    }
    return master_arr;
};



/********************************************************************************
 ** Function            : fetchUserDevice
 ** Description         : With this Api user can fetch the only those devices which 
 *                        user has permission in a network
 ** Input Parameters    : user_token ,network_token,user_role ,user_id
 ** Return Values       : {"status":true,"data":
 *                       [{"permission_givento":"hh_479_LEc2",
 *                       "permission_givenby":"hh_379_uwuq",
 *                       "device_token":"dv_62_rNly",
 *                       "device_mac":"ass:ass:ssssscf:df","device_name":
 *                        "my_Devices1","device_ip":"0.0.0.0"}]}
 ********************************************************************************/


exports.fetchUserDevice = function (req, res) {
    var auth_token = req.headers.authorization;
    var user_token = req.body.user_token;
    var user_id = req.body.user_id;
    var network_token = req.body.network_token;
    var user_role_login = req.body.user_role;

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response === 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);
                } else {
                    if (user_role_login == "sa" || user_role_login == "a") {
                        deviceModel.fetchDeviceInNetwork(user_token, network_token, function (response) {
                            var status = true;
                            var data = response;
                            var response = helper.sendResult(status, data);
                            res.send(response);
                        });
                    } else {
                        var status = false;
                        var resp_code = "28";
                        var message = language.getResponse(resp_code);
                        var response = helper.sendResult(status, message);
                        res.send(response);
                    }
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

/********************************************************************************
 ** Function            : deleteDevice
 ** Description         : With this Api user can delete device and its recordings
 ** Input Parameters    : user_id,serial_no
 ** Return Values       : status:-{True or False},data:-{Device deleted successfully}
 ********************************************************************************/

exports.deleteDevice = function (req, res) {

    var user_id = req.body.user_id;
    var auth_token = req.headers.authorization;
    var serial_no = req.body.serial_no;
    var user_token = req.body.user_token;

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response === 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);
                } else {
                    userModel.validateUser(user_id, function (response) {
                        if (response.length > 0) {
                            deviceModel.deleteDeviceInfo(serial_no, function (response) {
                                var result = deletefolderS3(serial_no, res);
                            });
                        } else {
                            var status = false;
                            var resp_code = "9";
                            var message = language.getResponse(resp_code);
                            var response = helper.sendResult(status, message);
                            res.send(response);
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

/*****************************
 * 
 * @param {type} serial_no
 * @param {type} res
 *****************************/

deletefolderS3 = function (serial_no, res) {
    var params = {
        Bucket: config.bucket,
        Prefix: serial_no + '/'
    };

    var s3 = new AWS.S3({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    });

    s3.listObjects(params, function (err, data) {
        if (err) {
            console.log("error in listing object");
            console.log(err);
        } else {
            console.log("listing objects -->");
            console.log(data);

            if (data.Contents.length > 0) {
                var params = {Bucket: config.bucket};
                params.Delete = {};
                params.Delete.Objects = [];

                data.Contents.forEach(function (content) {
                    params.Delete.Objects.push({Key: content.Key});

                });
                console.log(params);
                s3.deleteObjects(params, function (err, data) {
                    if (err) {
                        console.log("error in delete objects--->")
                        console.log(err);
                    } else {
                        console.log("objects deleted");
                    }
                });
            }

            /******update shadow to null************/
            var iotdata = new AWS.IotData({endpoint: config.iotEndpoint, region: config.region,
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey

            });
            var event = {
                state: null
            };

            var params = {
                payload: JSON.stringify(event),
                thingName: serial_no
            };
            iotdata.updateThingShadow(params, function (err, data) {
                if (err) {
                    console.log("error from update thing shadow");
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log("success from update thing shadow");
                    console.log(data);           // successful response
                }
            });


            console.log("No of objetcs deleted are --->");
            console.log(data);
            var status = true;
            var resp_code = "29";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);

        }

    });
};



/********************************************************************************
 ** Function            : deleteNetwork
 ** Description         : With this Api user can delete device the network and related information
 ** Input Parameters    : network_name,serial_no,user_token,network_token,user_role
 ** Return Values       : status:-{True or False},data:-{network successfully deleted or
 *                        network successfully removed from your account}
 ********************************************************************************/

exports.deleteNetwork = function (req, res) {

    var user_token = req.body.user_token;
    var auth_token = req.headers.authorization;
    var network_token = req.body.network_token;
    var user_role = req.body.user_role;
    var network_name = req.body.network_name;
    var serial_no = req.body.serial_no;

    deviceModel.checkTokenExist(auth_token, function (response) {
        if (response === 0) {
            var decoded = jwt.verify(auth_token, config.secret, function (err, value) {
                if (err) {
                    var status = false;
                    var resp_code = "10";
                    var message = language.getResponse(resp_code);
                    var response = helper.sendResult(status, message);
                    res.send(response);

                } else {
                    if (user_role == "u") {
                        deviceModel.deleteUserNetwork(network_token, user_token, function (response) {
                            var result = deletefolderS3Network(serial_no, res, user_role, network_name);

                        });
                    } else {
                        deviceModel.deleteAdminNetwork(network_token, function (response) {
                            var result = deletefolderS3Network(serial_no, res, user_role, network_name);
                        });
                    }
                }
            });
        } else {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};


deletefolderS3Network = function (serial_no, res, user_role, network_name) {
    for (var i = 0; i < serial_no.length; i++) {
        var params = {
            Bucket: config.bucket,
            Prefix: serial_no[i]
        };
        var s3 = new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        });

        console.log("vaue of i is --->", i);

        s3.listObjects(params, function (err, data) {
            if (err) {
                console.log("error in listing object");
                console.log(err);
            } else {
                console.log("listing objects -->");
                console.log(data);

                if (data.Contents.length > 0) {
                    var params = {Bucket: config.bucket};
                    params.Delete = {};
                    params.Delete.Objects = [];

                    data.Contents.forEach(function (content) {
                        params.Delete.Objects.push({Key: content.Key});

                    });
                    var key = data.Contents[0].Key;
                    key = key.split("/");
                    console.log(key[0]);

                    s3.deleteObjects(params, function (err, data) {
                        if (err) {
                            console.log("error in delete objects--->");
                            console.log(err);
                        } else {
                            console.log("objects deleted");
                        }

                    });
                }


                /******update shadow to null************/
                var iotdata = new AWS.IotData({endpoint: config.iotEndpoint, region: config.region,
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey

                });
                var event = {
                    state: null
                };
                //console
                var params = {
                    payload: JSON.stringify(event),
                    thingName: key[0]
                };

                console.log(params);
                iotdata.updateThingShadow(params, function (err, data) {
                    if (err) {
                        console.log("error from update thing shadow");
                        console.log(err, err.stack); // an error occurred
                    } else {
                        console.log("success from update thing shadow");
                        console.log(data);           // successful response
                    }
                });
            }
        });
    }

    console.log("No of objetcs deleted are --->");
    if (user_role == "u") {
        var status = true;
        var message = network_name + " " + "successfully removed from your account";
        var response = helper.sendResult(status, message);
        res.send(response);
    } else {
        var status = true;
        var message = network_name + " " + "successfully deleted";
        var response = helper.sendResult(status, message);
        res.send(response);
    }

};

/********************************************************************************
 ** Function            : nightModeNotification
 ** Description         : With this Api user will recieve the  push when night mode is off
 ** Input Parameters    : this api will be triggered by cron job after 1 minute
 ** Return Values       : status:-{True or False},data:-{night mode is updated or
 *                        success from update thing shadow or push is sent}
 ********************************************************************************/

exports.nightModeNotification = function (req, res) {

    var data = [];
    var serial_no = [];
    var date = new Date();
    var timestamp = date.getTime();
    var eight_hours_back = timestamp - 28800000;
    var id = [];

    //fetching all the serial_no which have night mode timestamp more than hours
    deviceModel.nightModeTimestamp(eight_hours_back, function (device_details) {

        if (device_details.length > 0) {
            for (var i = 0; i < device_details.length; i++) {
                var device_serial_no = device_details[i].device_serial_no;
                serial_no.push(device_serial_no);
            }
            //notification of the devices on the basis of serial no where push status is 0
            deviceModel.fetchDeviceNotification(serial_no, function (push_message) {

                deviceModel.fetchAllUserOfDevice(serial_no, function (result) {

                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var republishTopic = result[i].user_token;
                            if ((result[i].user_role == "u") && (result[i].user_token == result[i].permission_givento) || (result[i].user_role == "a") || (result[i].user_role == "sa")) {
                                data.push(republishTopic);
                            }
                        }
                        //fetching all the end points   of the list of users
                        deviceModel.SelectEndPoint(data, function (endpoint) {
                            //calling push function
                            sendPush(push_message, endpoint);

                            deviceModel.ChangeNightModeStatus(serial_no, function (response) {
                                console.log("night mode status is updated");
                            });
                            for (var i = 0; i < push_message.length; i++) {
                                var notification_id = push_message[i].id;
                                id.push(notification_id);
                            }
                            deviceModel.changePushStatus(id, function (result) {
                                console.log("push status is updated");
                            });
                            for (var i = 0; i < serial_no.length; i++) {
                                var iotdata = new AWS.IotData({endpoint: config.iotEndpoint, region: config.region,
                                    accessKeyId: config.accessKeyId,
                                    secretAccessKey: config.secretAccessKey
                                });
                                var event = {
                                    "state": {
                                        "reported": {
                                            "night_mode": "0"

                                        }
                                    },
                                    "serial_no": serial_no[i]
                                };

                                var params = {
                                    payload: JSON.stringify(event),
                                    thingName: serial_no[i]
                                };

                                iotdata.updateThingShadow(params, function (err, data) {
                                    if (err) {
                                        console.log("error from update thing shadow");
                                        console.log(err, err.stack); // an error occurred
                                    } else {
                                        console.log("success from update thing shadow");
                                        console.log(data);           // successful response
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
};

function sendPush(push_message, endpoint) {

    if (endpoint.length > 0)
    {
        var data = [];
        for (i = 0; i < endpoint.length; i++) {
            for (j = 0; j < push_message.length; j++) {
                var noti_name = push_message[j].notification_name;
                var serial_no = push_message[j].device_serial_no;
                var network_token = push_message[j].network_token_fk;
                var arn = endpoint[i].token_awsendpt;

                var pushformat = {
                    "GCM": "{ \"data\": { \"message\":\"" + noti_name + "\",\"device_serial_no\":\"" + serial_no + "\" ,\"network_token\":\"" + network_token + "\"} }",
                    "APNS_SANDBOX": "{\"aps\":{\"alert\":\"" + noti_name + "\",\"device_serial_no\":\"" + serial_no + "\",\"network_token\":\"" + network_token + "\"}}"
                };
                // console.log(pushformat);
                var payload = JSON.stringify(pushformat);
                console.log('sending push');
                sns.publish({
                    Message: payload,
                    MessageStructure: 'json',
                    TargetArn: arn
                }, function (err, data) {
                    if (err) {
                        console.log(err.stack);
                        return;
                    }
                    console.log('push sent');
                });
            }

        }
    }
}
