/*
	Model for User data
 */

var config = require('../config')();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema defining user's history data
var userDataSchema = new Schema({
	dataString: String,
	date: { type: Date, default: Date.now() }
});

// Schema defining user's complete data
var userInformationSchema = new Schema({
	identifier: { type: String, index: true, unique: true },
	historyLimit: { type: Number, default: config.mongo.user.defaultHistoryLimit},
	dataSizeLimit: { type: Number, default: config.mongo.user.defaultDataSizeLimit},
	userData: { type: [userDataSchema], default: [] }
});
userInformationSchema.set('autoIndex', false);

// Data model for user's information schema
var userInformationModel = mongoose.model(config.mongo.collection, userInformationSchema);
module.exports = userInformationModel;