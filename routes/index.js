var user = require('../controllers/userController');
var device = require('../controllers/deviceController');
var cronjob = require('../controllers/cronjobController');
var helper = require('../common/helper');

exports.route = function (app) {

    app.post('/login', user.login);
    app.post('/register', user.register);
    app.post('/add-network', device.addNetwork);
    app.post('/forgot-password', user.forgotPassword);
    app.post('/reset-password', user.resetPassword);
    app.post('/add-device', device.addDevice);
    app.get('/registration-link/:id', user.registrationLink);
    app.post('/add-user', user.addUser);
    app.post('/fetch-network', user.fetchNetwork);
    app.get('/user-activation/:id', user.userActivation);
    app.post('/logout', user.logout);
    app.post('/recording-list', device.recordingList);
    app.post('/otp-login', user.otpLogin);
    app.post('/fetch-user', user.fetchUser);
    app.post('/fetch-device-access', device.fetchUserDevice);
    app.post('/delete-device', device.deleteDevice);
    app.post('/view-profile', user.viewProfile);
    app.post('/delete-network', device.deleteNetwork);
    app.post('/night-mode-notification', device.nightModeNotification);
    app.post('/setting-password',user.settingPassword);
    };




