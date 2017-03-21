var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = {
  lambda: '2015-03-31'
  // other service API versions
};


var lambda = new AWS.Lambda({
//    endpoint: 'lambda.us-west-2.amazonaws.com',
//    region: 'us-west-2',
    accessKeyId: 'AKIAIOKZOEGS4OB3LORQ',
    secretAccessKey: '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'});

//var params = {
//  
//  MaxItems: 2
//};
//lambda.listFunctions(params, function(err, data) {
//  if (err) console.log(err, err.stack); // an error occurred
//  else     console.log(data);           // successful response
//});

//var params = {
//  FunctionName: 'haloDeviceRule' /* required */
//  
//};
//lambda.getFunctionConfiguration(params, function(err, data) {
//  if (err) console.log(err, err.stack); // an error occurred
//  else     console.log(data);           // successful response
//});


var event  = {
    state : {
        reported : {
            ip : "7.1.1.1"
        }
    },
    serial_no : "1233"
};

// var hello = event.state.reported.ip;
// console.log(hello);


var params = {
  
  FunctionName: "haloDeviceRule", 
  Payload: JSON.stringify(event)
 };
 lambda.invoke(params, function(err, data) {
   if (err) {
       console.log("error");
       console.log(err); // an error occurred
   }    
   else {
       console.log("hi");
       console.log(data);
   }           // successful response
   
 });


