"use strict";

let isLocal = false;

module.exports = {
	local: isLocal,
	secret: 'so7many1creative2unicorns',
	database: 'mongodb://nikolaset:z3co4c7125@ds021943.mlab.com:21943/csgo-db',
	port: process.env.PORT || 3000,
	maxMsgCount: 75,
	excludeProperties: '-_id -__v'
};
