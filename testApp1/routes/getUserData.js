
/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();
var crypto = require('crypto');

exports.controller = function(app) {

	app.post('/getUserData', function(req, res){
		// Get the key that was used to encrypt the data
		var encodedKey = new Buffer(req.body.key).toString();
		var keyDecipher = crypto.createDecipher(config.crypto.algo, config.crypto.symmetricKey);
		var clearKey = keyDecipher.update(encodedKey, config.crypto.decode.inputEncoding, config.crypto.decode.outputEncoding);
		clearKey += keyDecipher.final(config.crypto.decode.outputEncoding);

		// Get the decrypted data
		var encryptedData = new Buffer(req.body.data).toString();
		var dataDecipher = crypto.createDecipher(config.crypto.algo, clearKey);
		var clearData = dataDecipher.update(encryptedData, config.crypto.decode.inputEncoding, config.crypto.decode.outputEncoding);
		clearData += dataDecipher.final(config.crypto.decode.outputEncoding);

		// Get the base 64 decoded data
		var decodedData = new Buffer(clearData, 'base64').toString();

		// Get the identifier and index
		var jsonData = JSON.parse(decodedData);
		var useridentifier = jsonData.userIdentifier;
		var index = jsonData.dataAtIndex;

		// Get the data
		var datamodel = null;
		var currentUserModel = userInformationModel.find({identifier: useridentifier}).exec(function(err, docs) {
			if(err || docs == null || docs[0] == null)
			{
				res.send('User not found');
			}
			else if( docs != null && docs[0] != null )
			{
				var offset = docs[0].historyLimit - parseInt(index);
				if( offset < 0 || isNaN(offset) )
				{
					res.send('Invalid index');
				}
				else
				{
					var existingData = docs[0].userData;
					var dataRequestedByUser = existingData[ offset ].dataString;
					res.send(dataRequestedByUser);
				}
			}
			else
			{
				res.send('Some error');
			}
		});
	});

}