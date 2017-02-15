"use strict";
let passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy,
    config = require('./config'),
    User = require('../models/user'),
    userController = require('../controllers/user.controller'),
    winston = require('winston');

module.exports = function() {
    // Steam auth
    passport.use(new SteamStrategy({
        returnURL: config.local ? 'http://192.168.1.12:3000/auth/steam/return' : 'http://csgooverflow.com/auth/steam/return',
        realm: config.local ? 'http://192.168.1.12:3000/' : 'http://csgooverflow.com/',
        apiKey: 'CE9D7E2DDD6AB89F45AB84C211B52C29',
        passReqToCallback: true
    },
    function(req, identifier, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            var steamUser = profile._json;

            // get the user from the database
            User.findOne({ id: steamUser.steamid }, (err, user) => {
                if (err) throw err;

                if (!user) {
                    // Create new user if not in database
                    steamUser.referrer = req.cookies.refId;
                    userController.postCreateNewUser(steamUser, (err, newUser) => {
                        if (err) {
                            winston.log('create_user_failed', 'id: ' + steamUser.steamid + ' msg: ' + err.message);
                            return;
                        }

                        return done(null, newUser);
                    });
                } else {
                    user.name = steamUser.personaname;
                    user.avatarUrl = steamUser.avatar;
                    user.update({ name: user.name, avatarUrl: user.avatarUrl }, (err) => {
                        if (err) {
                            winston.log('update_user_failed', 'id: ' + steamUser.steamid + ' msg: ' + err.message);
                            return;
                        } else {
                            return done(null, user);
                        }
                    })
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        if (user) {
            return done(null, user.id);
        }
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({id: id}).exec(function(err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
                return;
            }

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    });
};
