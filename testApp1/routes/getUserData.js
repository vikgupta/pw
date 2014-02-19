
/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();
var encryptionManager = require('../common_modules/encryptionWrapper');

exports.controller = function(app) {

	app.post('/getUserData', function(req, res){
		// Get the key that was used to encrypt the data
		var encodedKey = new Buffer(req.body.key).toString();
		var clearKey = encryptionManager.symmetricDecryption( encodedKey, config.crypto.symmetricKey );

		// Get the base 64 decoded decrypted data
		var encryptedData = new Buffer(req.body.data).toString();
		var clearData = encryptionManager.symmetricDecryption( encryptedData, clearKey );
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
					var encryptedDataForReturn = encryptionManager.symmetricEncryption( dataRequestedByUser, clearKey );
					var status = "{" + "\"errorCode\":\"" + "0" + "\", \"errorDesc\":\"" + "Success" + "\", \"data\":\"" + encryptedDataForReturn + "\"}";
					res.send(status);
				}
			}
			else
			{
				res.send('Some error');
			}
		});
	});

}

/*
{
	"errorCode":"0",
	"errorDesc":"Success",
	"data":"<data encrypted with the key>"
}
*/