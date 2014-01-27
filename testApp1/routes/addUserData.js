
/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userInformationModel = require('../models/userDataModel');
var config = require('../config')();

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

		// Get the data from headers
		var useridentifier = req.headers.useridentifier;
		var data = req.headers.userdata;

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
							res.send('Data successfully added');
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