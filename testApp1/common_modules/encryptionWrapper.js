
/**
 * Module dependencies.
 */

var config = require('../config.js')();
var crypto = require('crypto');

var encryptionManager = module.exports = {
	symmetricEncryption : function(inData, inKey) {
		var dataCipher = crypto.createCipher(config.crypto.algo, inKey);
		var encData = dataCipher.update(inData, config.crypto.encode.inputEncoding, config.crypto.encode.outputEncoding);
		encData += dataCipher.final(config.crypto.encode.outputEncoding);

		return encData;
	},

	symmetricDecryption : function(inData, inKey) {
		var dataDecipher = crypto.createDecipher(config.crypto.algo, inKey);
		var decData = dataDecipher.update(inData, config.crypto.decode.inputEncoding, config.crypto.decode.outputEncoding);
		decData += dataDecipher.final(config.crypto.decode.outputEncoding);

		return decData;
	}
}
