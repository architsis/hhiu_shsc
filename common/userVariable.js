exports.loginSchema = {
    type: 'object',
    properties: {
        user_email: {
            type: 'string',
            required: true,
            format: 'email',
            minLength: 1
          },
        user_pwd: {
            type: 'string',
            required: true,
            minLength: 1
          },
      }
  };

exports.networkSchema = {
    type: 'object',
    properties: {
        network_name: {
            type: 'string',
            required: true,
            minLength: 1,
            
          },
       lat: {
            type: 'string',
            required: true ,
            minLength: 1
          },
   long: {
            type: 'string',
            required: true,
            minLength: 1
          },
       network_address : {
            type: 'string',
            required: true,
            minLength: 1
       }
      }
  };
  exports.forgotSchema = {
    type: 'object',
    properties: {
        user_email: {
            type: 'string',
            required: true,
            format: 'email',
            minLength: 1
          },
       
      }
  };