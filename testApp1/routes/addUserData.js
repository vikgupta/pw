
/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();
var encryptionManager = require('../common_modules/encryptionWrapper');

exports.controller = function(app) {

	app.post('/addUserData', function(req, res){
		/*if(req.headers.userdatatype == 'Base64Encoded')
		{
			var base64EncodedData = new Buffer(req.headers.userdata, 'base64').toString();
		}
		else
		{
			var base64DecodedData = new Buffer(req.headers.userdata).toString('base64');
		}*/

		// Get the key that was used to encrypt the data
		var encodedKey = new Buffer(req.body.key).toString();
		var clearKey = encryptionManager.symmetricDecryption(encodedKey, config.crypto.symmetricKey );

		// Get the base 64 decoded data that was encrypted using key
		var encryptedData = new Buffer(req.body.data).toString();
		var clearData = encryptionManager.symmetricDecryption( encryptedData, clearKey );
		var decodedData = new Buffer(clearData, 'base64').toString();

		// Get the identifier and data
		var jsonData = JSON.parse(decodedData);
		var useridentifier = jsonData.userIdentifier;
		var data = jsonData.userData;

		// Add / update the data
		var datamodel = null;
		var currentUserModel = userInformationModel.find({identifier: useridentifier}).exec(function(err, docs) {
			if(err || docs == null || docs[0] == null)
			{
				res.send('User not found');
			}
			else if( docs != null && docs[0] != null )
			{
				if( docs[0].dataSizeLimit >= data.length)
				{
					// Update the data model
					var existingData = docs[0].userData;
					if( existingData.length < docs[0].historyLimit )
					{
						console.log('Just appending the data');
					}
					else
					{
						console.log('Removing oldest data');
						existingData.splice(0, 1);
					}
					existingData.push({dataString: data, date: Date.now()});

					userInformationModel.findByIdAndUpdate( docs[0]._id, 
					{
						userData: existingData
					},
					function( err, doc ){
						if( err )
						{
							res.send(err);
						}
						else
						{
							var status = "{" + "\"errorCode\":\"" + "0" + "\", \"errorDesc\":\"" + "Success" + "\"}";
							res.send(status);
						}
					});
				}
				else
				{
					res.send('Please upgrade your plan to support bigger data');
				}
			}
			else
			{
				res.send(err.toString());
			}
		});
	});

}

/*
{
	"errorCode":"0",
	"errorDesc":"Success"
}
*/