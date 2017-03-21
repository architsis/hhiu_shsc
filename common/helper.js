var randomstring = require('randomstring');
var random = require("random-js")();
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.randomOtp = function(){
    return random.integer(789000, 987000);
};

exports.randomNumber = function(){
      return randomstring.generate(4);
};

exports.sendResult = function (status, data) {
    var type_of_data = typeof (data);
    if (type_of_data === "object") {
        var response = {
            "status": status,
            "data": data
        };
    } else {
        var response = {
            "status": status,
            "message": data
        };
    }

    response = JSON.stringify(response);
    return response;
};

exports.encrypt = function (user_password) {
    var pass = (new Buffer(user_password).toString('base64'));
    return pass;
};

exports.decrypt = function (user_pic) {
    var pass = (new Buffer(user_pic, 'base64').toString('ascii'));
    return pass;
};

exports.options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "halohomeus@gmail.com", //your mail
        pass: "halohome_us"// your password
    }
};
exports.mailForgotPassword = function (user_email, otp) {
    var response =
            {
                from: config.mail_from,
                to: user_email,
                subject: 'Forgot Password',
                text: 'You have recieved new mail',
                html: "<html<head>"+
		"<meta http-equiv='Content-Type' content='text/html;charset=utf-8' /></head>"
	+"<!----- body start -------->"
	+"<body><div style='BACKGROUND-COLOR:#e8e8e8'><table border='0' cellspacing='0' cellpadding='0' width='100%'>"
	+"<tbody><tr><td><table style='background:url(http://127.0.0.1:3000/email/HALO_otp.png) no-repeat; background-size: cover; ' border='0' cellspacing='0' cellpadding='0' width='700' align='center'>"
	+"<tbody ><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px;  padding-bottom:20px;'>"
	+"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table>"
        +"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:90px; padding-bottom:20px; '>"
	+"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	+"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h3 style='font-style: italic; text-align:center;'> Based on your request we have sent an Otp. Use this Otp to login in to your account</h3></p>"
        +"</td></tr><tr><td align='center'>"
	+"<!--OPT TEXT -->"
	+"<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
	+"<tbody><tr><td align='center' style='padding-top: 25px;' class='padding'>"
	+"<table border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'>"
	+"<tbody><tr><td align='center' style='border-radius: 3px; border-radius: 3px; padding: 17px 70px 20px 62px; color: black;background: lightgrey;letter-spacing: 8px; font-weight: 800;'>"+otp+"</td>"
        +"</tr></tbody></table></td></tr>"
	+"</tbody></table></td></tr>"
        +"<tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
	+"</tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	+"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
	+"</tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	+"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
	+"</tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'></h4> </p>"
	+"</td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px; '>"
        +"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table></td></tr>"
        +"<tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px; '>"
	+"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table></td></tr>"
	+"<tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px; '>"
	+"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table></td></tr>"
	+"<tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px; '>"
	+"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table></td></tr>"
	+"<tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px; '>"
	+"<table border='0' cellspacing='0' cellpadding='0' width='100%'></table></td></tr></tbody></table></td></tr></tbody></table></div></body></html>"
            };
    return response;
};
exports.mailNewUser = function (user_email, otp, link,network_name,admin_name) {
    var response =
            {
                from: config.mail_from,
                to: user_email,
                subject: 'HALO HOME | New User added',
                text: 'You have recieved new mail',
                //html: '
                html :"<html><head>"
            	+"<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />"
        	+"</head><body><div style='BACKGROUND-COLOR:#e8e8e8'>"
		+"<table  style='background:url(http://127.0.0.1:3000/email/HALO_otp.png) no-repeat; background-size: cover;' border='0' cellspacing='0' cellpadding='0' width='100%'>"
                +"<tbody><tr><td><table  border='0' cellspacing='0' cellpadding='0' width='700' align='center'>"
		+"<tbody<tr><td  style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px;  padding-bottom:20px;'>"
		+"<table border='0' cellspacing='0' cellpadding='0' width='100%'>"
	        +"</table></td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:90px; padding-bottom:20px; '>"
	        +"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'>Hi You have been added in the "+network_name+" network by "+admin_name+"</h2></p>"

 +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'>Please use your email and below given OTP to login in to your account <br><br> This OTP will get expire within 24 hours </h2></p>"

+"<table width='100%' border='0' cellspacing='0' cellpadding='0'>"
	+"<tbody><tr><td align='center' style='padding-top: 25px;' class='padding'>"
	+"<table border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'>"
	+"<tbody><tr><td align='center' style='border-radius: 3px; border-radius: 3px; padding: 17px 70px 20px 62px; color: black;background: lightgrey;letter-spacing: 8px; font-weight: 800;'>"+otp+"</td>"
        +"</tr></tbody></table></td></tr>"
	+"</tbody></table></td></tr>"

		+"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
		+'<p style="LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;"><h2 style="font-style: italic; text-align:center;">'+user_email+'</h2></p></td>'
                +"</tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
		+"</tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;  ' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'>Please click below to verify your account</h4> </p>"
		+"</td></tr><tr><td align='center'><!-- BULLETPROOF BUTTON --><table width='100%' border='0' cellspacing='0' cellpadding='0'>"
		+"<tbody><tr><td align='center' style='padding-top: 25px;' class='padding'>"
	        +"<table border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'>"
	        +"<tbody><tr><td align='center' style='border-radius: 3px;' bgcolor='#256F9C'><a href="+link+" target='_blank' style='font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #256F9C; display: inline-block;' class='mobile-button'>Click Here →</a></td>"
		+"</tr></tbody></table>"+"</td></tr></tbody></table>"
	        +"<tr></tbody></table></td></tr></tbody></table></div></body></html>"
            };
    return response;

};

exports.mailExistingUser = function (user_email, link, network_name,admin_name) {
    var response =
            {
                from: config.mail_from,
                to: user_email,
                subject: 'HALO HOME | Account Activation Link',
                text: 'You have recieved new mail',
                html :"<html><head>"
            	+"<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />"
        	+"</head><body><div style='BACKGROUND-COLOR:#e8e8e8'>"
		+"<table  style='background:url(http://127.0.0.1:3000/email/HALO_otp.png) no-repeat; background-size: cover;' border='0' cellspacing='0' cellpadding='0' width='100%'>"
                +"<tbody><tr><td><table  border='0' cellspacing='0' cellpadding='0' width='700' align='center'>"
		+"<tbody<tr><td  style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px;  padding-bottom:20px;'>"
		+"<table border='0' cellspacing='0' cellpadding='0' width='100%'>"
	        +"</table></td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:90px; padding-bottom:20px; '>"
	        +"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'>Hi You have been added in the "+network_name+" network by "+admin_name+" </h2></p>"
                +"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
		+'<p style="LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;"><h2 style="font-style: italic; text-align:center;">'+user_email+'</h2></p></td>'
                +"</tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
		+"</tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;  ' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'>Please click below to verify your account</h4> </p>"
		+"</td></tr><tr><td align='center'><!-- BULLETPROOF BUTTON --><table width='100%' border='0' cellspacing='0' cellpadding='0'>"
		+"<tbody><tr><td align='center' style='padding-top: 25px;' class='padding'>"
	        +"<table border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'>"
	        +"<tbody><tr><td align='center' style='border-radius: 3px;' bgcolor='#256F9C'><a href="+link+" target='_blank' style='font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #256F9C; display: inline-block;' class='mobile-button'>Click Here →</a></td>"
		+"</tr></tbody></table>"+"</td></tr></tbody></table>"
	        +"<tr></tbody></table></td></tr></tbody></table></div></body></html>"
            };
    return response;
};



exports.generateToken = function (req) {
    var token = jwt.sign({
        auth: 'magic',
        //agent: req.headers['user-agent'],
        exp: Math.floor(Date.now() / 1000) + (2073600), // Note: in seconds! 
    }, config.secret)  // secret is defined in the environment variable JWT_SECRET 
    return token;
};


exports.mailRegister = function (user_email,link,name) {
    var response =
            {
                from: config.mail_from,
                to: user_email,
                subject: 'Halo Home | Email Verification Link',
                text: 'You have recieved a new mail',
                html : "<html><head>"
            	+"<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />"
        	+"</head><body><div style='BACKGROUND-COLOR:#e8e8e8'>"
		+"<table  style='background:url(http://127.0.0.1:3000/email/HALO_otp.png) no-repeat; background-size: cover;' border='0' cellspacing='0' cellpadding='0' width='100%'>"
                +"<tbody><tr><td><table  border='0' cellspacing='0' cellpadding='0' width='700' align='center'>"
		+"<tbody<tr><td  style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:20px;  padding-bottom:20px;'>"
		+"<table border='0' cellspacing='0' cellpadding='0' width='100%'>"
	        +"</table></td></tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px; PADDING-TOP:90px; padding-bottom:20px; '>"
	        +"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'>You signed up for a HaloHome account using the email </h2></p>"
		+"</td></tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
		+'<p style="LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;"><h2 style="font-style: italic; text-align:center;">'+user_email+'</h2></p></td>'
                +"</tr><tr><td  style='PADDING-BOTTOM:1px;PADDING-LEFT:40px;PADDING-RIGHT:40px; '>"
	        +"<p style='LINE-HEIGHT:20px;COLOR:#333;FONT-SIZE:13px;FONT-FAMILY:Arial; margin-top:11px; text-align:justify;color:#032a4b;'><h2 style='font-style: italic; text-align:center;'> </h2></p></td>"
		+"</tr><tr><td style='PADDING-LEFT:40px;PADDING-RIGHT:40px;  ' valign='top'><p style='LINE-HEIGHT:20px; font-size:14px; font-family:Arial; color:black;'></b><h4  style='font-style: italic; text-align:center;'>Please confirm your email address by clicking on the following button</h4> </p>"
		+"</td></tr><tr><td align='center'><!-- BULLETPROOF BUTTON --><table width='100%' border='0' cellspacing='0' cellpadding='0'>"
		+"<tbody><tr><td align='center' style='padding-top: 25px;' class='padding'>"
	        +"<table border='0' cellspacing='0' cellpadding='0' class='mobile-button-container'>"
	        +"<tbody><tr><td align='center' style='border-radius: 3px;' bgcolor='#256F9C'><a href="+link+" target='_blank' style='font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #256F9C; display: inline-block;' class='mobile-button'>Click Here →</a></td>"
		+"</tr></tbody></table>"+"</td></tr></tbody></table>"
	        +"<tr></tbody></table></td></tr></tbody></table></div></body></html>"
            };
    return response;
};


exports.send_err = function (err) {
    var response = {
        "status": false,
        "data": "Your token has expired"
    };
    response = JSON.stringify(response);
    return response;
};
