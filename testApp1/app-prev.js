
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var userData = require('./routes/userData');
var http = require('http');
var path = require('path');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
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

// Connect with the DB
mongoClient.connect('mongodb://localhost:27017/mytestdb', function(err, db) {
	if(err)
	{
		console.log('Error creating mongodb instance');
	}
	else
	{
	    var attachDB = function(req, res, next) {
	        req.db = db;
	        next();
	    };

	    app.get('/', attachDB, routes.index);
		app.get('/users', attachDB, user.list);
		app.post('/addString', attachDB, userData.addDataString)

		http.createServer(app).listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});
	}
});


