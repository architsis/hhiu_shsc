var AWS = require('aws-sdk');
var mysql = require('mysql');
var config = require('../config');
var sns = new AWS.SNS({accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.snsEndpoint,
    region: config.region
});
var connection = mysql.createConnection({
    host: config.base_url,
    user: config.arr.db_username,
    password: config.arr.db_password,
    database: config.arr.db_name,
    debug: false
});
connection.connect();

function getValues(data, user_token, endpointArn) {
    var token = {
        token_appIdentifier: data.app_identifier,
        token_value: data.app_token,
        token_platform: data.app_platform,
        token_status: 1,
        token_awsendpt: endpointArn,
        token_user_token_fk: user_token
    };
    return token;
}

function checkTokenExists(data, user_token, callback) {
    connection.query('SELECT * from halo_device_pushtoken where token_value = ? and token_user_token_fk = ?', [data.app_token, user_token], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows.length);
        }
    });
}

exports.createEndpoint = function (data, user_token) {
    checkTokenExists(data,user_token, function (result) {
        if (result == 0) {
            if (data.app_platform == 'ios') {
                var app_arn = 'arn:aws:sns:us-west-2:009517463730:app/APNS_SANDBOX/hhiu_development';
            } else {
                var app_arn = 'arn:aws:sns:us-west-2:009517463730:app/GCM/hhiu_android_push';
            }
            sns.createPlatformEndpoint({
                PlatformApplicationArn: app_arn, 
                Token: data.app_token
            }, function (err, result) {
                if (err) {
                    console.log(err.stack);
                    return;
                }
                var endpointArn = result.EndpointArn;
                console.log("//////////////////////////", endpointArn)
                var insertData = getValues(data, user_token, endpointArn);
                storeEndpoint(insertData);
            });
        }
    });
};

function storeEndpoint(values) {
    connection.query('INSERT INTO halo_device_pushtoken SET ?', values);
};

exports.updateTokenStatus = function (app_token) {
    connection.query('update halo_device_pushtoken set token_status = ? where token_value = ?', [0, app_token]);
};

            