"use strict";
let passport = require('passport'),
    jwt = require('jsonwebtoken'),
    config = require('./config');

module.exports = {
    isAuthenticated: function(req, res, next) {
        // check cookie, header or url parameters or post parameters for token
    	var token = req.cookies.token || req.body.token || req.param('token') || req.headers['x-access-token'];

    	// decode token
    	if (token) {
    		// verifies secret and checks exp
    		jwt.verify(token, config.secret, function(err, decoded) {
    			if (err) {
    				return res.json({ success: false, message: 'Failed to authenticate token.' });
    			} else {
    				// if everything is good, save to request for use in other routes
    				req.decoded = decoded;
    				next();
    			}
    		});

    	} else {
    		// if there is no token
    		// return an error
    		return res.status(403).send({
    			success: false,
    			message: 'No token provided.'
    		});
    	}
    }
}
