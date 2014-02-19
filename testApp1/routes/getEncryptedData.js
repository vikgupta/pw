/*
 * POST whatever sent by user.
 */

var config = require('../config')();
var encryptionManager = require('../common_modules/encryptionWrapper');

exports.controller = function(app) {
	app.post('/getEncryptedData', function(req, res){
		var clearKey 			= req.body.key;
		var clearIdentifier 	= req.body.userIdentifier;
		var clearDataOrIndex 	= req.body.userData;
		var dataInJSONForm = "{" + "\"userIdentifier\":\"" + clearIdentifier + "\", \"userData\":\"" + clearDataOrIndex + "\"}";
		if( clearDataOrIndex == null || clearDataOrIndex == '')
		{
			clearDataOrIndex = req.body.dataAtIndex;
			var dataInJSONForm = "{" + "\"userIdentifier\":\"" + clearIdentifier + "\", \"dataAtIndex\":\"" + clearDataOrIndex + "\"}";
		}

		// If still null, return
		if( clearDataOrIndex == null || clearDataOrIndex == '')
		{
			res.send('Incorrect request');
		}
		else
		{
			var clearBase64Data = new Buffer(dataInJSONForm).toString('base64');

			var encData = encryptionManager.symmetricEncryption( clearBase64Data, clearKey );
			var encKey = encryptionManager.symmetricEncryption( clearKey, config.crypto.symmetricKey );

			var jsondata = {"data":encData, "key":encKey};
			res.send(JSON.stringify(jsondata));
		}
	});
}

/*
{
	"key":"testKey",
	"userIdentifier":"<id>",
	"userData":"<data>""
} 

Or

{
	"key":"testKey",
	"userIdentifier":"<id>",
	"dataAtIndex":"<data>""
} 

*/