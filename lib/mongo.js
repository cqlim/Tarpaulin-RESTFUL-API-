/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require("mongodb");

const mongoHost = process.env.MONGO_HOST || "192.168.99.100";
const mongoPort = process.env.MONGO_PORT || 3309;
const mongoUser = process.env.MONGO_USER || "businesses";
const mongoPassword = process.env.MONGO_PASSWORD || "hunter2";
const mongoDBName = process.env.MONGO_DATABASE || "businesses";

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

let db = null;

exports.connectToDB = function (callback) {
	MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
		if (err) {
			throw err;
		}
		db = client.db(mongoDBName);
		callback();
	});
};

exports.getDBReference = function () {
	return db;
};
