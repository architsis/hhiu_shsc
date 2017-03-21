var mysql = require('mysql');
var config = require('../config');

var connection = mysql.createConnection({
    host: config.base_url,
    user: config.arr.db_username,
    password: config.arr.db_password,
    database: config.arr.db_name,
    debug: false
});



/********************************************************************************
 ** Function            : fetchingdetails
 ** Description         : This function fetch all the details of the user with userid
 ********************************************************************************/

exports.fetchingDetails = function (row_id, callback) {
    connection.query('SELECT * from halo_user where user_id = ?', [row_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : registerNetwork
 ** Description         : This function create the network on the cloud
 ********************************************************************************/

exports.registerNetwork = function (post_data, callback) {
    connection.query('INSERT INTO halo_device_network SET ?', [post_data], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : checkNetworkExist
 ** Description         : This function checks the network tht is already exists with the same name
 ********************************************************************************/

exports.checkNetworkExist = function (post_data, callback) {
    connection.query('SELECT * from halo_device_network where network_name = ? AND network_created_by = ?', [post_data.network_name, post_data.network_created_by], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows.length);
        }

    });
};

/********************************************************************************
 ** Function            : updateNetworkToken
 ** Description         : This function check network already exists with the same name
 ********************************************************************************/

exports.updateNetworkToken = function (row_id, network_token, callback) {
    connection.query('UPDATE halo_device_network SET network_token = ? WHERE network_id = ?', [network_token, row_id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : insertRole
 ** Description         : This function insert the user role in user role table
 ********************************************************************************/

exports.insertRole = function (network_role_data, callback) {
    connection.query('INSERT INTO halo_user_role_in_network SET ?', network_role_data, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : registerDevice
 ** Description         : This function insert all the device information in device table
 ********************************************************************************/

exports.registerDevice = function (set_data, callback) {
    connection.query('INSERT INTO halo_device SET ?', [set_data], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }


    });
};

/********************************************************************************
 ** Function            : updateDeviceToken
 ** Description         : This function update the device table with device token
 ********************************************************************************/

exports.updateDeviceToken = function (row_id, device_token, callback) {
    connection.query('UPDATE halo_device SET device_token = ? WHERE device_id = ?', [device_token, row_id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : findnetwork
 ** Description         : this function return all the network with the user token
 ********************************************************************************/

exports.findNetwork = function (user_token, callback) {
    connection.query('SELECT * from halo_device_network where network_created_by = ?', [user_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : checkTokenExist
 ** Description         : this function return whether auth_token exists or not
 ********************************************************************************/

exports.checkTokenExist = function (auth_token, callback) {
    connection.query('SELECT count(auth_token) as c from halo_user where auth_token = ?', [auth_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result[0].c);
        }
    });
};


/********************************************************************************
 ** Function            : vaildateDeviceMac
 ** Description         : this function will check the device mac is unique or not
 ********************************************************************************/

exports.vaildateDeviceMac = function (device_mac, serial_no, callback) {

    connection.query('SELECT device_mac from halo_device where device_mac = ? OR device_serial_no = ?', [device_mac, serial_no], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};


/********************************************************************************
 ** Function            : fetchRecordingList
 ** Description         : This function will fetch all the device recordings based 
 on users access permission
 ********************************************************************************/

exports.fetchRecordingList = function (network_token, callback) {

    var sql = 'SELECT * FROM halo_device_recording where network_token = ?';
    connection.query(sql, [network_token], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : fetchRecordingListUser
 ** Description         : This function will fetch all the device recordings based 
 on users access permission
 ********************************************************************************/

exports.fetchRecordingListUser = function (network_token, callback) {
    var sql = 'select hr.* from halo_device_access_permission dp INNER JOIN halo_device_recording hr ON hr.device_token_fk = dp.device_token_fk WHERE hr.network_token = ? ORDER BY hr.created_on DESC';
    connection.query(sql, [network_token], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : fetchDeviceInNetwork
 ** Description         : This function will fetch devices in a network
 ********************************************************************************/

exports.fetchDeviceInNetwork = function (user_token, network_token, callback) {
    var sql = 'SELECT d.permission_givento,d.permission_givenby ,h.device_token,h.device_mac,h.device_name,h.device_ip' +
            ' FROM halo_device_access_permission d INNER JOIN halo_device h ON d.device_token_fk = h.device_token  WHERE d.permission_givento = ? and d.network_token_fk = ?';
    connection.query(sql, [user_token, network_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};


/********************************************************************************
 ** Function            : deleteDeviceInfo
 ** Description         : This function will delete the device on the basis of serial no
 ********************************************************************************/

exports.deleteDeviceInfo = function (serial_no, callback) {

    var sql = 'delete from halo_device where device_serial_no = ?';
    connection.query(sql, [serial_no], function (err, rows) {

        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};


/********************************************************************************
 ** Function            : deleteUserNetwork
 ** Description         : This function will delete all the users and their related devices 
 ********************************************************************************/

exports.deleteUserNetwork = function (network_token, user_token, callback) {
 var sql = 'DELETE halo_user_role_in_network, halo_device_access_permission FROM halo_user_role_in_network INNER JOIN halo_device_access_permission WHERE halo_user_role_in_network.network_token = halo_device_access_permission.network_token_fk AND halo_user_role_in_network.network_token = ? AND halo_user_role_in_network.user_token = ? AND halo_device_access_permission.permission_givento = ?';
    connection.query(sql, [network_token, user_token,user_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });

};
/********************************************************************************
 ** Function            : deleteAdminNetwork
 ** Description         : This function will delete all the super admin and admins and their related devices 
 ********************************************************************************/

exports.deleteAdminNetwork = function (network_token, callback) {
    var sql = 'delete from halo_device_network where network_token = ?';
    connection.query(sql, [network_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : fetchDeviceNotification
 ** Description         : This function will fetch all the device notification
 ********************************************************************************/

exports.fetchDeviceNotification = function (serial_no, callback) {
    var sql = 'SELECT * FROM halo_device_notification where device_serial_no IN (?) and push_status = ?';
    connection.query(sql, [serial_no, 0], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : fetchAllUserOfDevice
 ** Description         : This function will fetch all the user related to the device
 ********************************************************************************/

exports.fetchAllUserOfDevice = function (serial_no, callback) {
    var sql = 'SELECT d.user_token, d.user_role, p.permission_givento ' +
            'FROM halo_device h INNER JOIN halo_user_role_in_network d ON ' +
            'd.network_token = h.network_token LEFT JOIN halo_device_access_permission p ' +
            'ON p.permission_givento = d.user_token AND p.device_token_fk = h.device_token ' +
            'WHERE h.device_serial_no IN (?)';
    connection.query(sql, [serial_no], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};
/********************************************************************************
 ** Function            : SelectEndPoint
 ** Description         : This function will fetch all endpoints related to the user
 ********************************************************************************/

exports.SelectEndPoint = function (data, callback) {
    connection.query('SELECT  token_awsendpt from halo_device_pushtoken where token_user_token_fk IN (?) and token_status = ?', [data, 1], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : nightModeTimestamp
 ** Description         : This function will fetch all the users whose night mode
 *                         duration is more than 8 hours
 ********************************************************************************/

exports.nightModeTimestamp = function (timestamp, callback) {
    var sql = 'SELECT * FROM halo_device where night_mode = ? and night_mode_timestamp <= ?';
    connection.query(sql, [1, timestamp], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : ChangeNightModeStatus
 ** Description         : This function will update the night mode status
 ********************************************************************************/

exports.ChangeNightModeStatus = function (serial_no, callback) {
    var sql = 'UPDATE  halo_device SET night_mode = ? WHERE device_serial_no IN (?)';
    connection.query(sql, [0, serial_no], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : changePushStatus
 ** Description         : This function will update the push status
 ********************************************************************************/

exports.changePushStatus = function (id, callback) {
    var sql = 'UPDATE  halo_device_notification SET push_status = ? where id IN (?)';
    connection.query(sql, [1, id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};
