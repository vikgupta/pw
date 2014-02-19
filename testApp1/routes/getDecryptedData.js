/*
 * POST whatever sent by user.
 */

var config = require('../config')();
var encryptionManager = require('../common_modules/encryptionWrapper');

exports.controller = function(app) {
	app.post('/getDecryptedData', function(req, res){
		var clearKey 	= req.body.key;
		var encData 	= req.body.userData;

		var decData = encryptionManager.symmetricDecryption( encData, clearKey );
		res.send(decData);
	});
}

/*
{
	"key":"testKey",
	"userData":"d30748c0e0a247b08544cf74dd00c5f64bf9949d1d3fa2edf909537f610136c0"
}
*/