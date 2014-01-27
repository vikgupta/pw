
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var config = require('./config')();
var mongoose = require('mongoose');

// Initialize the express application
var app = express();

// database connection
mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('DB connected!!');
});

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('configData', config);
app.use(express.favicon());
app.use(express.logger(config.environment.logger));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// dynamically include routes (Controller)
fs.readdirSync('./routes').forEach(function (file) {
	if(file.substr(-3) == '.js') {
  		var route = require('./routes/' + file);
  		route.controller(app);
	}
});

http.createServer(app).listen(config.environment.port, function(){
  console.log('Express server listening on port ' + config.environment.port);
});


