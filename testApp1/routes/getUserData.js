
/*
 * POST whatever sent by user.
 */

var mongoose = require('mongoose');
var userDataModel = require('../models/userDataModel');

exports.controller = function(app) {

	app.get('/getUserData/:id', function(req, res){

		if(userDataModel)
		{
			var data = req.headers.userdata;
			if(req.headers.userdatatype != 'Base64Encoded')
			{
				data = new Buffer(data).toString('base64');
			}

			userDataModel.find({}).sort({date:1}).exec(function(err, docs){
				docs[0].remove();
			});

			var datamodel = new userDataModel({dataString: data});
			datamodel.save(function(err){
				if(err)
				{
					res.send(err);
				}
				else
				{
					res.send('Data successfully set');
				}
			});
		}
		else
		{
			res.send('DB couldn\'t be connected');
		}
		//res.send(req.params.id);
	});

}