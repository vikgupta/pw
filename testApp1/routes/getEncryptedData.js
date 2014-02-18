/*
 * POST whatever sent by user.
 */

var config = require('../config')();
var crypto = require('crypto');

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

			var dataCipher = crypto.createCipher(config.crypto.algo, clearKey);
			var encData = dataCipher.update(clearBase64Data, config.crypto.encode.inputEncoding, config.crypto.encode.outputEncoding);
			encData += dataCipher.final(config.crypto.encode.outputEncoding);

			var keyCipher = crypto.createCipher(config.crypto.algo, config.crypto.symmetricKey);
			var encKey = keyCipher.update(clearKey, config.crypto.encode.inputEncoding, config.crypto.encode.outputEncoding);
			encKey += keyCipher.final(config.crypto.encode.outputEncoding);

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