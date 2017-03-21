var express = require('express');
var app = express();
var config = require('../config');
var mysql = require('mysql');
var helper = require('../common/helper');

//create mysql connection
var connection = mysql.createConnection({
    host: config.base_url,
    user: config.arr.db_username,
    password: config.arr.db_password,
    database: config.arr.db_name,
    debug: false
});

connection.connect();

/********************************************************************************
 ** Function            : validateEmail
 ** Description         : This function check whether email exists or not
 ********************************************************************************/

exports.validateEmail = function (user_email, callback) {
    connection.query('SELECT user_email from halo_user where user_email = ?', [user_email], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};


/********************************************************************************
 ** Function            : validateLogin
 ** Description         : This function return user  information with
 *                        the help of user_password 
 ********************************************************************************/

exports.validateLogin = function (req, callback) {
    var user_password = req.user_pwd;
    var encrypted_password = helper.encrypt(user_password);
    var user_email = req.user_email;
      
    var con = connection.query('SELECT * from halo_user where user_email = ? and user_password = ?', [user_email, encrypted_password], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : validateOtpLogin
 ** Description         : This function return user  information with
 *                        the help of user_otp
 ********************************************************************************/

exports.validateOtpLogin = function (req, callback) {
    var user_password = req.user_pwd;
    var user_email = req.user_email;
      
    var con = connection.query('SELECT * from halo_user where user_email = ? and user_otp = ?', [user_email, user_password], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

exports.checkUserStatus = function (user_email, callback) {
    connection.query('SELECT user_account_status from halo_user where user_email = ?', [user_email], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : insertingDetails
 ** Description         : This function insert the user details in user table
 ********************************************************************************/

exports.insertingDetails = function (data, callback) {
    connection.query('INSERT INTO halo_user SET ?', data, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var id = result.insertId;
            callback(id);
        }

    });
};

/********************************************************************************
 ** Function            : updateUserToken
 ** Description         : This function insert the usertoken in user table
 ********************************************************************************/

exports.updateUserToken = function (rowId, updatepic, callback) {
    connection.query('UPDATE halo_user SET ? WHERE user_id = ?', [updatepic, rowId], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};

/********************************************************************************
 ** Function            : fetchingdetails
 ** Description         : This function fetch all the details of the user with userid
 ********************************************************************************/

exports.fetchingDetails = function (rowId, callback) {
    connection.query('SELECT * from halo_user where user_id = ?', [rowId], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};
/********************************************************************************
 ** Function            : resetOtp
 ** Description         : This function set otp status to zero
 ********************************************************************************/

exports.resetOtp = function (user_email) {
    connection.query('update halo_user set otp_status = ? where user_email = ?', ["0", user_email], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : insertUpdateData
 ** Description         : This function update the user table 
 ********************************************************************************/

exports.insertUpdateData = function (updatedata, user_email, callback) {
    connection.query('UPDATE halo_user SET ?  WHERE user_email = ?', [updatedata, user_email], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};

/********************************************************************************
 ** Function            : updatePasswordWithOtp
 ** Description         : This function update the user status and user password 
 ********************************************************************************/

exports.updatePasswordWithOtp = function (updatedata, user_id, callback) {
    connection.query('UPDATE halo_user SET ?  WHERE user_id = ?', [updatedata, user_id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};

/********************************************************************************
 ** Function            : updateUserRole
 ** Description         : This function update the user status and user password 
 ********************************************************************************/

exports.updateUserRole = function (data, callback) {
    connection.query('INSERT INTO halo_user_role_in_network SET ?', data, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : activeUserStatus
 ** Description         : This function update the user status to 1 
 ********************************************************************************/

exports.activeUserStatus = function (token, callback) {
    connection.query('UPDATE halo_user SET user_account_status = ? where user_token = ?', ["1", token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};

/********************************************************************************
 ** Function            : activeUserAccount
 ** Description         : This function update the user status to 1 
 ********************************************************************************/

exports.activeUserAccount = function (user_email, callback) {
    connection.query('UPDATE halo_user SET user_account_status = ? where user_email = ?', ["1", user_email], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};

/********************************************************************************
 ** Function            : activeNetworkStatus
 ** Description         : This function update the network status to 1 
 ********************************************************************************/


exports.activeNetworkStatus = function (userToken, nw_token, callback) {
    connection.query('UPDATE halo_user_role_in_network SET user_network_status = ?  WHERE user_token = ? and network_token =?', ["1", userToken, nw_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};


/********************************************************************************
 ** Function            : checkTokenExist
 ** Description         : This function will check whether token exists or not 
 ********************************************************************************/

exports.checkTokenExist = function (token, callback) {
    connection.query('SELECT user_token from halo_user where user_token = ?', token, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : networkDetailsWithToken
 ** Description         : This function will return network details with the help of usertoken 
 ********************************************************************************/


exports.networkDetailsWithToken = function (token, callback) {


   var sql = 'SELECT d.user_token, d.user_role, h.device_name,h.battery_status,h.home_mode,h.night_mode,h.privacy_mode,n.network_token,n.network_name ,n.network_id,h.device_token,h.device_serial_no,h.device_ip,p.permission_givento'+
                ' FROM halo_user_role_in_network d INNER JOIN halo_device_network n ON n.network_token = d.network_token '+
             'LEFT JOIN halo_device h ON h.network_token = d.network_token LEFT JOIN halo_device_access_permission p ON p.permission_givento = d.user_token and p.device_token_fk = h.device_token WHERE d.user_token = ? and d.user_network_status = 1'
    connection.query(sql, [token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }

    });
};


/********************************************************************************
 ** Function            : checkNetworkTokenAlreadyExist
 ** Description         : This function will check whether the token exists or not  
 ********************************************************************************/

exports.checkNetworkTokenAlreadyExist = function (token, callback) {
    connection.query('SELECT * from halo_device_network where network_token = ?', token, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : checkNetworkUser
 ** Description         : This function will give the details user role table 
 ********************************************************************************/



exports.checkNetworkUser = function (nw_token, token, callback) {
    connection.query('SELECT * from halo_user_role_in_network where network_token = ? and user_token = ?', [nw_token, token], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }

    });
};

/********************************************************************************
 ** Function            : fetchDeviceDetails
 ** Description         : This function will fetch the device details from device table
 ********************************************************************************/

exports.fetchDeviceDetails = function (nw_token, callback) {
    connection.query('SELECT * from halo_device where network_token = ?', nw_token, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : fetchDeviceWithAccessPermission
 ** Description         : This function will fetch the device token
 ********************************************************************************/



exports.fetchDeviceWithAccessPermission = function (nw_token, user_token, callback) {
    connection.query('SELECT device_token_fk from halo_device_access_permission where network_token_fk = ? and permission_givento =?', [nw_token, user_token], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }

    });
};

/********************************************************************************
 ** Function            : fetchDeviceDetailsWithDeviceTsoken
 ** Description         : This function will return the device information
 ********************************************************************************/



exports.fetchDeviceDetailsWithDeviceTsoken = function (dev_token, callback) {
    connection.query('SELECT * from halo_device where device_token = ?', dev_token, function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }

    });
};

/********************************************************************************
 ** Function            : getUserTokenUserTable
 ** Description         : This function will return the user_token with the help 
 *                        of user_id
 ********************************************************************************/

exports.getUserTokenUserTable = function (data, callback) {
    connection.query('SELECT * from halo_user where user_id = ? or user_email =?', [data,data], function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};


/********************************************************************************
 ** Function            : networkNameWithToken
 ** Description         : This function will return the network_token ,network_name
 *                        user_role with the help of  user_token
 ********************************************************************************/


exports.networkNameWithToken = function (token, callback) {
    connection.query("SELECT d.network_token,d.user_role, e.network_name  FROM halo_user_role_in_network d INNER JOIN halo_device_network e ON d.network_token = e.network_token where d.user_token = ?", token, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : userList
 ** Description         : This function will return the user_token ,network_token
 *                        with the help of nw_token
 ********************************************************************************/


exports.userList = function (nw_token, callback) {
    var sql = 'SELECT d.user_token, d.user_role,d.user_network_status,h.user_first_name,h.user_last_name,h.user_email,d.network_token'+
                ' FROM halo_user_role_in_network d INNER JOIN halo_user h ON d.user_token = h.user_token  WHERE d.network_token = ?';
    connection.query(sql, [nw_token], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};


/********************************************************************************
 ** Function            : validateUser
 ** Description         : This function will return the user_id ,user_token
 *                        with the help of user_id
 ********************************************************************************/


exports.validateUser = function (user_id, callback) {
    connection.query('SELECT user_id from halo_user where user_id = ?', user_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            callback(rows);
        }
    });
};

/********************************************************************************
 ** Function            : insertDeviceAccessPermission
 ** Description         : This function will return the user_token with the help 
 *                        of user_id
 ********************************************************************************/


exports.insertDeviceAccessPermission = function (master_array, callback) {
    var sql = "INSERT INTO halo_device_access_permission (device_token_fk, permission_givento, permission_givenby, created_on, network_token_fk) VALUES ? ";  
    connection.query(sql, [master_array], function (err,result) {
    if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
};

/********************************************************************************
 ** Function            : insertToken
 ** Description         : This function will insert user_token
 ********************************************************************************/

exports.insertToken = function(auth_token,user_id){
  connection.query('update halo_user SET auth_token = ? where user_id =?' , [auth_token,user_id], function (err,result){
      if(err){
         console.log(err);
      }
      else{
          console.log(result);
      }
  });  
};

/********************************************************************************
 ** Function            : countUserRole
 ** Description         : This function will count the user role
 ********************************************************************************/

exports.countUserRole = function(user_role,network_token,callback){
  connection.query('SELECT count(*) as role from halo_user_role_in_network where user_role = ? and network_token =?' , [user_role,network_token], function (err,result){
      if(err){
         console.log(err);
      }
      else{
          callback(result);
      }
  });  
};

/********************************************************************************
 ** Function            : updatePasswordWithNew
 ** Description         : This function will update the password
 ********************************************************************************/

exports.updatePasswordWithNew = function(current_passwod,new_password,user_id,callback){

    connection.query('UPDATE halo_user SET user_password = ?  where user_password = ? and user_id = ?', [new_password, current_passwod,user_id], function (err, result) {
      if(err){
         console.log(err);
          }
      else{
                callback(result);
          }
  });  
};