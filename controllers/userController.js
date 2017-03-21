var express = require('express');
var app = express();
var userModel = require('../models/userModel');
var sendPushModel = require('../models/sendPushModel');
var helper = require('../common/helper');
var nodemailer = require('nodemailer');
var formidable = require('formidable');
var deviceModel = require('../models/deviceModel');
var fs = require('file-system');
var config = require('../config');
var jwt = require('jsonwebtoken');
var language = require('../common/language');



/********************************************************************************
 ** Function            : login
 ** Description         : With this Api user can login into his/her account
 ** Input Parameters    : (email,password)
 ** Return Values       : status:-{True},data:-{"status":true,
 *                        "data":{"user_token","user_otp"
 *                        ,"otp_status" "userName","userPic","token"}
 *                        stattus:-{false},data:{Email and Password does not match,
 *                        You are not a member of Halo Network.Please Sign up to continue.}
 ********************************************************************************/

exports.login = function (req, res) {

    var data = req.body;
    var user_email = req.body.user_email;
    var user_password = req.body.user_pwd;

    userModel.validateEmail(user_email, function (emailResponse) {
        if (emailResponse.length > 0) {
            userModel.checkUserStatus(user_email, function (userResponse) {
                if (userResponse[0].user_account_status === 0) {
                    var status = false;
                    var resp_code = "1";
                    var message = language.getResponse(resp_code);
                    var result = helper.sendResult(status, message);
                    res.send(result);
                } else {
                    userModel.validateLogin(data, function (loginResponse) {
                        if (loginResponse.length > 0) {
                            var authToken = helper.generateToken(loginResponse);
                            if (loginResponse[0].otp_status == 0) {
                                sendPushModel.createEndpoint(req.body, loginResponse[0].user_token);
                                var status = true;
                                var data = {
                                    user_token: loginResponse[0].user_token,
                                    user_id: loginResponse[0].user_id,
                                    user_otp: loginResponse[0].user_otp,
                                    otp_status: 0,
                                    userName: loginResponse[0].user_first_name,
                                    userPic: loginResponse[0].user_pic,
                                    token: authToken
                                };
                                var result = helper.sendResult(status, data);
                                res.send(result);
                            } else if (loginResponse[0].otp_status == 2) {
                                sendPushModel.createEndpoint(req.body, loginResponse[0].user_token);
                                var status = true;
                                var data = {
                                    user_token: loginResponse[0].user_token,
                                    user_id: loginResponse[0].user_id,
                                    user_otp: loginResponse[0].user_otp,
                                    otp_status: 1,
                                    userName: loginResponse[0].user_first_name,
                                    userPic: loginResponse[0].user_pic,
                                    token: authToken
                                };
                                var result = helper.sendResult(status, data);
                                res.send(result);
                            }

                        } else {
                            var status = false;
                            var resp_code = "2";
                            var message = language.getResponse(resp_code);
                            var result = helper.sendResult(status, message);
                            res.send(result);
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "3";
            var message = language.getResponse(resp_code);
            var result = helper.sendResult(status, message);
            res.send(result);
        }
    });
};

/********************************************************************************
 ** Function            : otpLogin
 ** Description         : With this Api user can login into his/her account
 ** Input Parameters    : (email,otp)
 ** Return Values       : status:-{True},data:-{"status":true,
 *                        "data":{"user_token","user_otp"
 *                        ,"otp_status" "userName","userPic","token"}
 *                        stattus:-{false},data:{Otp Expired,Invalid Otp
 *                        You are not a member of Halo Network.Please Sign up to continue.}
 ********************************************************************************/

exports.otpLogin = function (req, res) {

    var data = req.body;
    var user_email = req.body.user_email;
    var user_password = req.body.user_pwd;
    var date = new Date();
    var timestamp = date.getTime();
    userModel.validateEmail(user_email, function (emailResponse) {
        if (emailResponse.length > 0) {
            userModel.checkUserStatus(user_email, function (userResponse) {
                if (userResponse[0].user_account_status === 0) {
                    var status = false;
                    var resp_code = "1";
                    var message = language.getResponse(resp_code);
                    var result = helper.sendResult(status, message);
                    res.send(result);
                } else {
                    userModel.validateOtpLogin(data, function (loginResponse) {
                        if (loginResponse.length > 0) {
                            var authToken = helper.generateToken(loginResponse);
                            var status = true;
                            var otp_timestamp = loginResponse[0].otp_sent_timestamp;
                            var difference_time = timestamp - otp_timestamp;

                            if (difference_time <= config.timestamp_hours) {
                                sendPushModel.createEndpoint(req.body, loginResponse[0].user_token);
                                var data = {
                                    user_token: loginResponse[0].user_token,
                                    user_id: loginResponse[0].user_id,
                                    user_otp: loginResponse[0].user_otp,
                                    otp_status: 1,
                                    userName: loginResponse[0].user_first_name,
                                    userPic: loginResponse[0].user_pic,
                                    token: authToken
                                };
                                var result = helper.sendResult(status, data);
                                res.send(result);
                            } else {
                                var status = false;
                                var resp_code = "20";
                                var message = language.getResponse(resp_code);
                                var result = helper.sendResult(status, message);
                                res.send(result);
                            }
                        } else {
                            var status = false;
                            var resp_code = "21";
                            var message = language.getResponse(resp_code);
                            var result = helper.sendResult(status, message);
                            res.send(result);
                        }
                    });
                }
            });
        } else {
            var status = false;
            var resp_code = "3";
            var message = language.getResponse(resp_code);
            var result = helper.sendResult(status, message);
            res.send(result);
        }
    });
};



/********************************************************************************
 ** Function            : register
 ** Description         : With this Api user can signup
 ** Input Parameters    : email,fname,lname,password,pic
 ** Return Values       : status:-{True or False},data:-{this email_id already exists,{"status":true,"data":{"user_token":"sa_114_KJeR","user_name":"archie","user_pic":"ghh"}}
 ********************************************************************************/

exports.register = function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var user_email = fields.user_email;
        var user_fname = fields.fname;
        var user_lname = fields.lname;
        var user_password = fields.password;
        if (files.hasOwnProperty('pic')) {
            var user_pic = files.pic.path;
            var pic_type = files.pic.type.substring(6);
        }
        userModel.validateEmail(user_email, function (emailResponse) {
            if (emailResponse.length > 0) {
                var status = false;
                var resp_code = "4";
                var message = language.getResponse(resp_code);
                var response = helper.sendResult(status, message);
                res.send(response);
            } else {
                var encrypted_passowrd = helper.encrypt(user_password);
                var date = new Date();
                var timestamp = date.getTime();
                var set_data = {
                    user_first_name: user_fname,
                    user_last_name: user_lname,
                    user_email: user_email,
                    user_password: encrypted_passowrd,
                    user_account_status: 0,
                    user_updated_on: timestamp
                };

                // inserting the user details
                userModel.insertingDetails(set_data, function (callback) {
                    var string = helper.randomNumber();
                    var user_id = callback;
                    var role_token = "hh";
                    var user_token = role_token + '_' + user_id + '_' + string;

                    if (files.hasOwnProperty('pic')) {
                        fs.rename(user_pic, config.static_path + '/user_image/' + user_token + "." + pic_type, function (err) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('renamed complete');
                            }
                        });
                        var path = "/user_image/" + user_token + "." + pic_type;
                    }

                    var update_pic = {
                        user_token: user_token,
                        user_pic: path
                    };

                    // updating user detail with the user_token
                    userModel.updateUserToken(user_id, update_pic, function (result) {
                        userModel.fetchingDetails(user_id, function (result_details) {

                            var random = helper.randomOtp();
                            var user_email = result_details[0].user_email;
                            var date = new Date();
                            var timestamp = date.getTime();
                            var enc_token = random + ":" + user_email + ":" + timestamp;
                            var encrypted_token = helper.encrypt(enc_token);
                            var link = "http://" + req.get('host') + "/registration-link/" + encrypted_token;
                            var mailoption = helper.options;
                            var transporter = nodemailer.createTransport(mailoption);
                            var mailsetting = helper.mailRegister(user_email, link, user_fname);

                            // sending mail to the user with otp
                            transporter.sendMail(mailsetting, function (error, info) {
                                if (error) {
                                    return console.log(error);
                                } else {
                                    var status = true;
                                    var resp_code = "19";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
                                }
                            });
                        });
                    });
                });
            }

        });
    });
};


/* *****************************************************
 ** Function            : forgotpassword
 ** Description         : With this Api user can recover his/her password
 ** Input Parameters    : email
 ** Return Values       : status:-{True or False},data:-{Mail has been sent to your emailid and this email id doesnt exist}
 ********************************************************************************/
exports.forgotPassword = function (req, res) {
    var user_email = req.body.user_email;

    //to check whether email exits or not
    userModel.validateEmail(user_email, function (response) {
        if (response.length > 0) {
            var date = new Date();
            var timestamp = date.getTime();
            var user_otp = helper.randomOtp();
            var update_data = {
                user_otp: user_otp,
                otp_sent_timestamp: timestamp
            };

            //update details with otp ,otpstatus,timestamp
            userModel.insertUpdateData(update_data, user_email, function (callback) {
                var mailoption = helper.options;
                var transporter = nodemailer.createTransport(mailoption);
                var mailsetting = helper.mailForgotPassword(user_email, user_otp);

                // sending mail to the user with otp
                transporter.sendMail(mailsetting, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        var status = true;
                        var resp_code = "5";
                        var message = language.getResponse(resp_code);
                        var response = helper.sendResult(status, message);
                        res.send(response);
                    }
                });
            });
        } else {
            var status = false;
            var resp_code = "6";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};


/********************************************************************************
 ** Function            : resetpassword
 ** Description         : With this Api user can reset his/her password
 ** Input Parameters    : user_pwd
 ** Return Values       : status:-{True or False},data:-{Your password has been reset successfully and Your session has been expired}
 ********************************************************************************/

exports.resetPassword = function (req, res) {

    var auth_token = req.headers.authorization;
    var user_id = req.body.user_id;
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
                            var user_pwd = req.body.user_pwd;
                            var otp_status = "0";
                            var encrypted_passowrd = helper.encrypt(user_pwd);
                            var set_data = {
                                user_password: encrypted_passowrd,
                                otp_status: otp_status,
                                user_otp: "0"
                            };
                            //updating user table with password and otp status
                            userModel.updatePasswordWithOtp(set_data, user_id, function (callback) {
                                var status = true;
                                var resp_code = "8";
                                var message = language.getResponse(resp_code);
                                var response = helper.sendResult(status, message);
                                res.send(response);
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
 ** Function            : settingPassword
 ** Description         : With this Api user can reset his/her password
 ** Input Parameters    : user_id ,current_password ,new_password.
 ** Return Values       : status:-{True or False},data:-{Your password has been reset successfully and Your session has been expired}
 ********************************************************************************/

exports.settingPassword = function (req, res) {

    var auth_token = req.headers.authorization;
    var user_id = req.body.user_id;
    var current_password = req.body.current_password;
    var new_password = req.body.new_password;

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
                            var encrypt_password = helper.encrypt(current_password);
                            var encrypted_passowrd = helper.encrypt(new_password);
                            userModel.updatePasswordWithNew(encrypt_password, encrypted_passowrd, user_id, function (callback) {
                                if (callback.affectedRows == 1) {
                                    var status = true;
                                    var resp_code = "8";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
                                } else {
                                    var status = false;
                                    var resp_code = "30";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
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
 ** Function            : adduser
 ** Description         : With this Api SuperAdmin or admin can add users in their network
 ** Input Parameters    : {"fname":"archie","lname":"sisodia","email":"architssisodia@gmail.com","network_token":"nt_4_8EQM","network_id":"4","role":"a"}
 ** Return Values       : status:-{True or False},data:-{"An Actvation link has been sent to user's email_id","A new user has been added successfully and activation link has been sent to his/her email id" and Your session has been expired}
 ********************************************************************************/

exports.addUser = function (req, res) {

    var user_id = req.body.user_id;
    var user_email = req.body.user_email;
    var auth_token = req.headers.authorization;
    var network_token = req.body.network_token;
    var user_role = req.body.user_role;
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
                            var user_token_admin = response[0].user_token;
                            var admin_name = response[0].user_first_name + " " + response[0].user_last_name;
                            userModel.countUserRole(user_role, network_token, function (response) {

                                if (user_role == "u" && response[0].role <= "8" || user_role == "a" && response[0].role <= "4") {
                                    //Check whether the user is already present in Halo network 
                                    userModel.validateEmail(user_email, function (response) {
                                        if (response.length > 0) {
                                            userModel.checkNetworkTokenAlreadyExist(network_token, function (response) {
                                                if (response.length > 0) {
                                                    // if nw token exists get user token of the user from user_table
                                                    userModel.getUserTokenUserTable(user_email, function (response) {
                                                        var user_token = response[0].user_token;

                                                        // Check if user is already added in this network
                                                        userModel.checkNetworkUser(network_token, user_token, function (response) {
                                                            if (response.length > 0) {
                                                                var status = false;
                                                                var resp_code = "11";
                                                                var message = language.getResponse(resp_code);
                                                                var response = helper.sendResult(status, message);
                                                                res.send(response);
                                                            } else {

                                                                var token = {
                                                                    user_token: user_token,
                                                                    admin_token: user_token_admin,
                                                                    otp: 0,
                                                                    admin_name: admin_name
                                                                };

                                                                var new_user = addUserRole(req, res, token);
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    var status = false;
                                                    var resp_code = "13";
                                                    var message = language.getResponse(resp_code);
                                                    var response = helper.sendResult(status, message);
                                                    res.send(response);
                                                }
                                            });
                                        } else {
                                            var otp = helper.randomOtp();
                                            var otp_string = otp.toString();
                                            var encrypt_password = helper.encrypt(otp_string);
                                            var random = helper.randomNumber();
                                            var date = new Date();
                                            var timestamp = date.getTime();
                                            var set_data = {
                                                user_first_name: "",
                                                user_last_name: "",
                                                user_email: user_email,
                                                user_account_status: 0,
                                                user_updated_on: timestamp,
                                                user_password: encrypt_password,
                                                user_created_by: user_token_admin,
                                                otp_status: 2,
                                                otp_sent_timestamp: timestamp
                                            };
                                            userModel.insertingDetails(set_data, function (id) {
                                                var user_id = id;
                                                var user_role = "hh";
                                                var user_token = user_role + '_' + user_id + '_' + random;
                                                var update_pic = {
                                                    user_token: user_token,
                                                };

                                                // updating user detail with the user_token
                                                userModel.updateUserToken(user_id, update_pic, function (result) {
                                                    var token = {
                                                        user_token: user_token,
                                                        admin_token: user_token_admin,
                                                        otp: otp,
                                                        admin_name: admin_name
                                                    };
                                                    var new_user = addUserRole(req, res, token);
                                                });
                                            });
                                        }
                                    });
                                } else {
                                    var status = false;
                                    if (user_role == "u") {
                                        var resp_code = "26";
                                    } else {
                                        var resp_code = "27";
                                    }
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
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
 ** Function            : userActivation
 ** Description         : With this Api user can activate his/her account
 ** Input Parameters    : user_token
 ** Return Values       : status:-{True or False},data:-{User account has been activated and "Invalid Response"}
 ********************************************************************************/

exports.userActivation = function (req, res) {

    var encrypt_token = req.params.id;
    var string = helper.decrypt(encrypt_token);
    var arr = string.split(":");
    var token = arr[0];
    var nw_token = arr[1];
    userModel.checkTokenExist(token, function (result) {
        var user_token = result[0].user_token;
        if (user_token) {
            userModel.activeUserStatus(token, function (result_user) {
                userModel.activeNetworkStatus(token, nw_token, function (result_network) {
                    res.sendfile(config.static_path + '/email' + '/user_network_status_halo.html');
                });
            });
        } else {
            var status = false;
            var resp_code = "3";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};

/********************************************************************************
 ** Function            : fetchNetwork
 ** Description         : With this Api user can have list of networks with their devices
 ** Input Parameters    : user_token
 ** Return Values       : data:-{"device information"}
 
 ********************************************************************************/
exports.fetchNetwork = function (req, res) {

    var auth_token = req.headers.authorization;
    var user_id = req.body.user_id;
    var data = [];
    var network = [];

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
                    //fetching user_token with the help of user_id
                    userModel.getUserTokenUserTable(user_id, function (response) {
                        if (response.length > 0) {
                            // fetching user role ,network token and network_name from user_role table and network_table
                            userModel.networkDetailsWithToken(response[0].user_token, function (result) {
                                if (result.length > 0) {
                                    var master_array = [];
                                    var sub_array = [];
                                    var j = 0;
                                    var k = 0;
                                    for (var i = 0; i < result.length; i++) {
                                        if ((result[i].user_role === "u") && (result[i].user_token === result[i].permission_givento) || result[i].user_role === "a" || result[i].user_role === "sa") {
                                            var network_token = result[i].network_token;
                                            var network_name = result[i].network_name;
                                            var network_id = result[i].network_id;
                                            var user_role = result[i].user_role;
                                            var device_token = result[i].device_token;
                                            var device_name = result[i].device_name;
                                            var device_serial_no = result[i].device_serial_no;
                                            var device_ip = result[i].device_ip;
                                            var night_mode = result[i].night_mode;
                                            var privacy_mode = result[i].privacy_mode;
                                            var home_mode = result[i].home_mode;
                                            var battery_status = result[i].battery_status;

                                            for (j = 0; j < master_array.length; j++) {

                                                if (result[i].network_token === master_array[j].network_token) {
                                                    if (device_token != null) {
                                                        var arr = {
                                                            device_name: device_name,
                                                            device_token: device_token,
                                                            device_serial_no: device_serial_no,
                                                            device_ip: device_ip,
                                                            night_mode: night_mode,
                                                            privacy_mode: privacy_mode,
                                                            home_mode: home_mode,
                                                            battery_status: battery_status
                                                        };
                                                    }
                                                    master_array[j].devices.push(arr);
                                                    k++;
                                                    break;
                                                }
                                                k = 0;
                                            }
                                            if (k === 0) {
                                                if (device_token === null) {
                                                    sub_array = {
                                                        network_token: network_token,
                                                        network_name: network_name,
                                                        network_id: network_id,
                                                        user_role: user_role,
                                                        devices: []
                                                    };
                                                } else {
                                                    sub_array = {
                                                        network_token: network_token,
                                                        network_name: network_name,
                                                        network_id: network_id,
                                                        user_role: user_role,
                                                        devices: [{
                                                                device_name: device_name,
                                                                device_token: device_token,
                                                                device_serial_no: device_serial_no,
                                                                device_ip: device_ip,
                                                                night_mode: night_mode,
                                                                privacy_mode: privacy_mode,
                                                                home_mode: home_mode,
                                                                battery_status: battery_status
                                                            }],
                                                    };
                                                }
                                                master_array.push(sub_array);
                                            }
                                        }
                                    }
                                    var status = true;
                                    var response = helper.sendResult(status, master_array);
                                    res.send(response);
                                } else {
                                    var status = false;
                                    var resp_code = "13";
                                    var message = language.getResponse(resp_code);
                                    var response = helper.sendResult(status, message);
                                    res.send(response);
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
 ** Function            : fetchuser
 ** Description         : With this Api user can have list of users
 ** Input Parameters    : user_id
 ** Return Values       : data:-{"user information"}
 
 ********************************************************************************/


exports.fetchUser = function (req, res) {

    var user_id = req.body.user_id;
    var network_token = req.body.network_token;
    var auth_token = req.headers.authorization;
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
                    userModel.userList(network_token, function (response) {
                        var status = true;
                        var data = response;
                        var response = helper.sendResult(status, data);
                        res.send(response);
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
 ** Function            : registrationLink
 ** Description         : With this Api user can activate his/her account
 ** Input Parameters    : user_token
 ** Return Values       : data:-{"User account has been activated"} or {"Invalid Response"}
 
 ********************************************************************************/

exports.registrationLink = function (req, res) {

    var encrypt_token = req.params.id;
    var string = helper.decrypt(encrypt_token);
    var arr = string.split(":");
    var user_email = arr[1];
    userModel.validateEmail(user_email, function (result) {
        if (result.length > 0) {
            var user_email = result[0].user_email;
            userModel.activeUserAccount(user_email, function (result_user) {
                res.sendfile(config.static_path + '/email' + '/otp_halo.html');
            });
        } else {
            var status = false;
            var resp_code = "3";
            var message = language.getResponse(resp_code);
            res.send(message);
        }
    });
};

/********************************************************************************
 ** Function            : logout
 ** Description         : With this Api user will be logged out from his/her account
 ** Input Parameters    : auth_token
 ** Return Values       : Successfully logged out
 
 ********************************************************************************/

exports.logout = function (req, res) {
    var auth_token = req.headers.authorization;
    var user_id = req.body.user_id;
    var app_token = req.body.app_token;
    userModel.insertToken(auth_token, user_id);
    sendPushModel.updateTokenStatus(app_token);
    var status = true;
    var resp_code = "15";
    var message = language.getResponse(resp_code);
    var response = helper.sendResult(status, message);
    res.send(response);
};


addUserRole = function (req, res, token) {

    var random = helper.randomNumber();
    var user_token = token.user_token;
    var admin_token = token.admin_token;
    var otp = token.otp;
    var network_token = req.body.network_token;
    var network_name = req.body.network_name;
    var role = req.body.user_role;
    var permission_devices = req.body.devices;
    var user_email = req.body.user_email;
    var date = new Date();
    var timestamp = date.getTime();
    var network_id = req.body.network_id;
    var master_array = [];
    var admin_name = token.admin_name;

    var role_data = {
        user_token: user_token,
        user_role: role,
        network_token: network_token,
        user_created_on: timestamp,
        user_network_status: 0,
        network_id_fk: network_id
    };

    userModel.updateUserRole(role_data, function (result) {
        var mailoption = helper.options;
        var transporter = nodemailer.createTransport(mailoption);
        var enc_token = user_token + ":" + network_token;
        var encrypted_token = helper.encrypt(enc_token);
        var link = "http://" + req.get('host') + "/user-activation/" + encrypted_token;
        if (otp) {
            var mailsetting = helper.mailNewUser(user_email, otp, link, network_name, admin_name);
            var resp_code = "14";
        } else {
            var mailsetting = helper.mailExistingUser(user_email, link, network_name, admin_name);
            var resp_code = "12";
        }

        if (role === "u") {

            for (var i = 0; i < permission_devices.length; i++) {
                var device_token_fk = permission_devices[i];
                var device_array = [
                    device_token_fk,
                    user_token,
                    admin_token,
                    timestamp,
                    network_token
                ];
                master_array.push(device_array);
            }
            userModel.insertDeviceAccessPermission(master_array, function (result) {
            });
        }
        // sending mail to the user
        transporter.sendMail(mailsetting, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(info);
                var status = true;
                var message = language.getResponse(resp_code);
                var response = helper.sendResult(status, message);
                res.send(response);
            }
        });

    });
};


/********************************************************************************
 ** Function            : viewProfile
 ** Description         : With this Api user can view the user profile
 ** Input Parameters    : user_id
 ** Return Values       : data:-{"data": {
 "user_name": "Hello harsh",
 "user_first_name": "harsh",
 "user_last_name": "rai",
 "user_email": "harsh789rai@gmail.com"
 }} or {"Your session has expired.Please login to continue."}
 ********************************************************************************/

exports.viewProfile = function (req, res) {

    var user_id = req.body.user_id;
    var auth_token = req.headers.authorization;

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
                    userModel.fetchingDetails(user_id, function (result) {
                        var data = {
                            userName: "Hello" + " " + result[0].user_first_name,
                            fname: result[0].user_first_name,
                            lname: result[0].user_last_name,
                            user_email: result[0].user_email
                        };
                        var status = true;
                        var result = helper.sendResult(status, data);
                        res.send(result);
                    });
                }
            });
        } else
        {
            var status = false;
            var resp_code = "10";
            var message = language.getResponse(resp_code);
            var response = helper.sendResult(status, message);
            res.send(response);
        }
    });
};


