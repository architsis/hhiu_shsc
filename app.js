var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');
app.use(bodyParser.json({limit :'50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

routes.route(app);

app.listen(3000,function(){
    console.log('listening on 3000')
});

