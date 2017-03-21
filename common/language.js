exports.getResponse = function (error_code) {

    switch (error_code) {
        case "1":
            var response = "Your account is not activated. Please click on the link given in the mail to activate it.";
            return response;
            break;
        case "2":
            var response = "Email and Password does not match";
            return response;
            break;
        case "3":
            var response = "You are not a member of Halo Network.Please Sign up to continue.";
            return response;
            break;
        case "4":
            var response = "This email id already exists.";
            return response;
            break;
        case "5":
            var response = "We've sent a new password to your email address.";
            return response;
            break;
        case "6":
            var response = "We couldn't find any record of the email address you entered.";
            return response;
            break;
        case "7":
            var response = "Network name should be unique.";
            return response;
            break;
        case "8":
            var response = "Your password has been reset successfully.";
            return response;
            break;
        case "9":
            var response = "Please enter valid user id.";
            return response;
            break;
        case "10":
            var response = "Your session has expired.Please login to continue.";
            return response;
            break;
        case "11":
            var response = "This user is already added in this network.";
            return response;
            break;
        case "12":
            var response = "An Actvation link has been sent to user's email_id.";
            return response;
            break;
        case "13":
            var response = "This network doesnt exist.";
            return response;
            break;
        case "14":
            var response = "A new user has been added successfully and activation link has been sent to his/her email id.";
            return response;
            break;
        case "15":
            var response = "Successfully logged out.";
            return response;
            break;
        case "16":
            var response = "Network is added.";
            return response;
            break;
        case "17":
            var response = "Device Mac should be unique.";
            return response;
            break;
        case "18":
            var response = "Device is added successfully.";
            return response;
            break;
        case "19":
            var response = "You have been registered successfully and an activation link has been sent to your email id";
            return response;
            break;
        case "20":
            var response = "Your OTP has expired";
            return response;
            break;
        case "21":
            var response = "Invalid OTP";
            return response;
            break;
        case "22":
            var response = "You dont have permission to add the device";
            return response;
            break;
        case "23":
            var response = "Device  is already added in your network";
            return response;
            break;
        case "24":
            var response = "Device is already added in any other network";
            return response;
            break;
        case "25":
            var response = "You have the permission to add the device";
            return response;
            break;
        case "26":
            var response = "limit of 8 users per netework has already been achieved.Please delete existing users for further addition";
            return response;
            break;
        case "27":
            var response = "limit of 4 admins per netework has already been achieved.Please delete existing admins for further addition";
            return response;
            break;
        case "28":
            var response = "You dont have permission to view the devices";
            return response;
            break;
        case "29":
            var response = "Device Deleted Successfully";
            return response;   
        case "30":
            var response = "Your current passoword doesnt match.";
            return response;    
    }
};

