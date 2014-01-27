/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();
var https = require('https');
var crypto = require('crypto');

exports.controller = function(app) {
	app.post('/userValidated', function(req, res){
		var urlString = config.rpxnow.url + config.rpxnow.apiKey + config.rpxnow.apiKeyString + '&' + config.rpxnow.token + req.body.token;
		//console.log(urlString);

		https.get(urlString, function(result){
			console.log(result.statusCode);
			result.on('data', function(data){
				var dataString = data.toString();
				var obj = JSON.parse(dataString);

				var shasum = crypto.createHash(config.digest);
				var identifierString = shasum.update(obj.profile.identifier).digest(config.encoding);

				//res.send(obj.profile.identifier);
				var currentUserModel = userInformationModel.find({identifier: identifierString}).exec(function(err, docs) {
					if(err || docs == null || docs[0] == null)
					{
						// create the new user
						console.log('Creating new user');
						datamodel = new userInformationModel();
						datamodel.identifier = identifierString;
						datamodel.save( function(err) {
							if(err)
							{
								res.send(err);
							}
							else
							{
								console.log('User successfully created');
								res.render('userValidated', {title: 'Pastewire', displayName: obj.profile.displayName, identifier: identifierString});
							}
						});
					}
					else
					{
						console.log('User : ' + identifierString + ' found');
						res.render('userValidated', {title: 'Pastewire', displayName: obj.profile.displayName, identifier: identifierString});
					}
				});
			});
		}).on('error', function(e){
			res.send(e.toString());
		});
	});
}