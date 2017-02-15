"use strict";
let config = require('./config'),
 	express = require('express'),
 	http = require('http');

module.exports = {
	io: null,
	init: function(server) {
		this.io = require('socket.io').listen(server);
		this.io.set("origins", "*:*");
	}
}
