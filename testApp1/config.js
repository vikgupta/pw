
/**
 * Config settings
 */

 var config = {
    local: {
    	environment: {
    		mode: 'local',
	        port: 3000,
	        logger: 'dev',	
    	},
        mongo: {
        	host: 'localhost',
        	port: 27017,
        	database: 'pastewire',
            collection: 'userinformation',
            user: {
                defaultHistoryLimit: 5,
                defaultDataSizeLimit: 512    
            }
        },
        rpxnow: {
            url: 'https://rpxnow.com/api/v2/auth_info?',
            apiKey: 'apiKey=',
            apiKeyString: '69035782a3638e19964cf9e60f129bd5fbc1fe85',
            token: 'token='
        },
        encoding: 'hex',
        digest: 'sha1',
        crypto: {
            algo: 'aes-256-cbc',
            encode: {
                inputEncoding: 'ascii',
                outputEncoding: 'hex'
            },
            decode: {
                inputEncoding: 'hex',
                outputEncoding: 'ascii'
            },
            symmetricKey: 'This is such a dumb-ass symmetric key!!! :)'
        }
    },
    staging: {
    	environment: {
    		mode: 'staging',
	        port: 4000,
	        logger: 'stage',
    	},
        mongo: {
        	host: 'localhost',
        	port: 27017,
        	database: 'pastewire',
            collection: 'userinformation',
            user: {
                defaultHistoryLimit: 5,
                defaultDataSizeLimit: 512    
            }
        },
        rpxnow: {
            url: 'https://rpxnow.com/api/v2/auth_info',
            apiKey: 'apiKey',
            apiKeyString: '69035782a3638e19964cf9e60f129bd5fbc1fe85',
            token: 'token'
        }
        ,
        encoding: 'hex',
        digest: 'sha1',
        crypto: {
            algo: 'aes-256-cbc',
            encode: {
                inputEncoding: 'ascii',
                outputEncoding: 'hex'
            },
            decode: {
                inputEncoding: 'hex',
                outputEncoding: 'ascii'
            },
            symmetricKey: 'P@$TE'
        }
    },
    production: {
    	environment: {
    		mode: 'production',
	        port: 5000,
	        logger: 'production',
    	},
        mongo: {
        	host: 'localhost',
        	port: 27017,
        	database: 'pastewire',
            collection: 'userinformation',
            user: {
                defaultHistoryLimit: 5,
                defaultDataSizeLimit: 512    
            }
        },
        rpxnow: {
            url: 'https://rpxnow.com/api/v2/auth_info',
            apiKey: 'apiKey',
            apiKeyString: '69035782a3638e19964cf9e60f129bd5fbc1fe85',
            token: 'token'
        },
        encoding: 'hex',
        digest: 'sha1',
        crypto: {
            algo: 'aes-256-cbc',
            encode: {
                inputEncoding: 'ascii',
                outputEncoding: 'hex'
            },
            decode: {
                inputEncoding: 'hex',
                outputEncoding: 'ascii'
            },
            symmetricKey: 'P@$TE'
        }
    }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}

