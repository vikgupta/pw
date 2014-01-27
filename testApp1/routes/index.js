/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();

exports.controller = function(app) {
	app.get('/', function(req, res){
		res.render('users', {user: 'PasteWire'});
	});
}