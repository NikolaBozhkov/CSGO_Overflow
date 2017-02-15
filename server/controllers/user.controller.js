"use strict";
let User = require('../models/user'),
    config = require('../config/config'),
    jwt = require('jsonwebtoken'),
    io = require('../config/socket').io;

const PUBLIC_USER_EXCLUDE = config.excludeProperties + ' -tradeUrl -staticCurrency -experience -experienceTreshold -withdrawnAmount -referrer -referrals -referralCurrency -clearance -won -lost -wins -losses -wonAmount -lostAmount -surveyLogs';

var userController = (function() {
    var userSocketPairs = new Object();
    var _users = [];
    var _usersIndex = {};

    function loadAllUsers(callback, forceNew) {
        if (typeof(forceNew) === 'undefined') forceNew = false;

        if (_users.length != 0 && !forceNew) {
            callback(null, _users, _usersIndex);
        } else {
            User.find({}, (err, dbUsers) => {
                if (err) {
                    console.log('error loading all users msg: ' + err.message);
                    callback(err, null, null);
                } else if (dbUsers) {
                    // populate new data
                    _users = dbUsers.slice();
                    _users.sort((a, b) => a.activeCurrency > b.activeCurrency ? -1 : (a.activeCurrency < b.activeCurrency ? 1 : 0));
                    _usersIndex = {};
                    for (let user of _users) {
                        _usersIndex[user.id] = user;
                    }

                    callback(null, _users, _usersIndex);
                } else {
                    let error = { message: 'Did not find users' };
                    callback(error, null, null);
                }
            });
        }
    }

    function getToken(socket) {
        // Get token out of cookie
        var cookies = socket.handshake.headers.cookie;
        var temp = cookies ? cookies.split('token=')[1] : null;
        var token = temp ? temp.split('; ')[0] : null;

        return token;
    }

    function onUserConnected(socket) {
        var token = getToken(socket);
        jwt.verify(token, config.secret, function(err, decoded) {
            if (!err) {
                var id = decoded.id;
                if (!userSocketPairs[id]) {
                    userSocketPairs[id] = [];
                }

                userSocketPairs[id].push(socket.id);
            }
        });
    }

    function onUserDisconnected(socket) {
        var token = getToken(socket);
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {
                if (!err) {
                    var id = decoded.id;

                    // Check if there is connected socket
                    if (userSocketPairs[id]) {
                        // Find and remove the socket
                        var index = userSocketPairs[id].indexOf(socket.id);
                        if (index > -1) {
                            userSocketPairs[id].splice(index, 1);
                        }

                        // Delete the id if there are no more sockets connected
                        if (userSocketPairs[id].length == 0) {
                            delete userSocketPairs[id];
                        }
                    }
                }
            });
        }
    }

    function emitDataToOnlineUser(eventName, data, userId) {
        if (userSocketPairs[userId]) {
            for (let socketId of userSocketPairs[userId]) {
                io.to(socketId).emit(eventName, data);
            }
        }
    }

    function defaultErrHandle(err, res) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

    function rewardReferrer(userId) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return console.log(err.message);

            let user = usersIndex[userId];
            if (user) {
                let fields = {
                    staticCurrency: user.staticCurrency + 1500,
                    referralCurrency: user.referralCurrency + 1500
                }

                user.update(fields, (err) => {
                    if (err) return console.log('error updating user: ' + user.id + ' msg: ' + err.message);

                    user.staticCurrency = fields.staticCurrency;
                    user.referralCurrency = fields.referralCurrency;
                });
            }
        });
    }

    function getUsers(req, res) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return defaultErrHandle(err, res);
            return res.json(users.map(user => createPublicUser(user)));
        });
    }

    function getActiveUsers(req, res) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return defaultErrHandle(err, res);

            var activeUsers = users.filter(user => user.activeCurrency != 0);
            return res.json(activeUsers.map(user => createPublicUser(user)));
        });
    }

    function getUser(req, res) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return defaultErrHandle(err, res);

            let user = usersIndex[req.decoded.id];
            if (user) {
                return res.json(user);
            } else {
                return res.status(404).json({ message: 'No user with id: ' + req.decoded.id });
            }
        });
    }

    function postCreateNewUser(steamUser, callback) {
        var newUser = new User({
            name: steamUser.personaname,
            id: steamUser.steamid,
            tradeUrl: '',
            avatarUrl: steamUser.avatar,
            staticCurrency: 100,
            activeCurrency: 0,
            level: 0,
            experienceTreshold: 0,
            experience: 0,
            wonAmount: 0,
            lostAmount: 0,
            wins: 0,
            losses: 0,
            referrer: '0',
            referrals: 0,
            referralCurrency: 0,
            withdrawnAmount: 0,
            clearance: 'none'
        });

        // Initilise treshold exp
        newUser.experience = 0;

        // Save referrals count
        if (steamUser.referrer && steamUser.referrer !== steamUser.steamid) {
            loadAllUsers((err, users, usersIndex) => {
                if (err) return callback(err, null);

                let user = usersIndex[steamUser.referrer];
                if (user) {
                    newUser.referrer = user.id;
                    user.update({ referrals: user.referrals + 1 }, (err) => {
                        if (err) return console.log('error updating user: ' + user.id + ' msg: ' + err.message);
                        user.referrals += 1;
                    });
                }

                newUser.save((err) => {
                    if (err) return callback(err, null);

                    User.findOne({ id: newUser.id }, (err, doc) => {
                        if (err) callback(err, null);

                        _users.push(doc);
                        _usersIndex[doc.id] = doc;

                        callback(err, newUser);
                    });
                });
            });
        } else {
            newUser.save((err) => {
                if (err) return callback(err, null);

                User.findOne({ id: newUser.id }, (err, doc) => {
                    if (err) callback(err, null);

                    _users.push(doc);
                    _usersIndex[doc.id] = doc;

                    callback(err, newUser);
                });
            });
        }
    }

    function createPublicUser(user) {
        return {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            activeCurrency: user.activeCurrency,
            level: user.level
        }
    }

    function putSaveTradeUrl(req, res) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return defaultErrHandle(err, res);

            let user = usersIndex[req.decoded.id];
            if (user) {
                user.update({ tradeUrl: req.body.tradeUrl }, (err) => {
                    if (err) return defaultErrHandle(err, res);

                    user.tradeUrl = req.body.tradeUrl;
                    return res.json({ message: 'success', tradeUrl: user.tradeUrl });
                });
            } else {
                return res.status(404).json({ message: 'No user with id: ' + req.decoded.id });
            }
        });
    }

    function putTransferToActive(req, res) {
        return putTransferCurrency(req, res, true);
    }

    function putTransferToStatic(req, res) {
        return putTransferCurrency(req, res, false);
    }

    function putTransferCurrency(req, res, toActive) {
        loadAllUsers((err, users, usersIndex) => {
            if (err) return defaultErrHandle(err, res);

            let user = usersIndex[req.decoded.id];
            if (user) {
                if ((toActive && req.body.amount <= user.staticCurrency && req.body.amount > 0)
                || (!toActive && req.body.amount <= user.activeCurrency  && req.body.amount > 0)) {
                    let newStatic = toActive ? user.staticCurrency - req.body.amount : user.staticCurrency + req.body.amount;
                    let newActive = toActive ? user.activeCurrency + req.body.amount : user.activeCurrency - req.body.amount;

                    if (toActive && user.flag) {
                        return res.status(400).json({ message: 'User is flagged for suspicious behavior' });
                    }

                    user.update({ staticCurrency: newStatic, activeCurrency: newActive }, (err) => {
                        if (err) return defaultErrHandle(err, res);

                        user.staticCurrency = newStatic;
                        user.activeCurrency = newActive;
                        return res.json(user);
                    });
                } else {
                    return res.status(400).json({ message: 'Not enough amount' });
                }
            } else {
                return res.status(404).json({ message: 'No user with id: ' + req.decoded.id });
            }
        });
    }

    function steamSuccessfulAuth(req, res) {
        // Successful authentication, redirect home.
        var token = jwt.sign({id: req.user.id, clearance: req.user.clearance}, config.secret, {
            expiresIn: '3d'
        });

        // Expire(max age) in 3d
        res.cookie('token', token, { maxAge: 60000 * 60 * 24 * 3, httpOnly: !config.local, secure: !config.local });
        res.cookie('loggedIn', true, { maxAge: 60000 * 60 * 24 * 3});

        res.redirect('/');
    }

    function logout(req, res) {
        res.clearCookie('token', { path: '/' });
        res.clearCookie('loggedIn', { path: '/' });
        res.json({message: 'success'});
    }

    function copyUser(user) {
        return new User({
            name: user.name,
            id: user.id,
            avatarUrl: user.avatarUrl,
            staticCurrency: user.staticCurrency,
            activeCurrency: user.activeCurrency,
            level: user.level,
            experienceTreshold: user.experienceTreshold,
            experience: user.experience,
            wonAmount: user.wonAmount,
            lostAmount: user.lostAmount,
            wins: user.wins,
            losses: user.losses,
            referrer: user.referrer,
            referrals: user.referrals,
            referralCurrency: user.referralCurrency,
            withdrawnAmount: user.withdrawnAmount,
            clearance: user.clearance
        });
    }

    return {
        loadAllUsers: loadAllUsers,
        userSocketPairs: userSocketPairs,
        defaultErrHandle: defaultErrHandle,
        rewardReferrer: rewardReferrer,
        onUserConnected: onUserConnected,
        onUserDisconnected: onUserDisconnected,
        emitDataToOnlineUser: emitDataToOnlineUser,
        getUser: getUser,
        getUsers: getUsers,
        getActiveUsers: getActiveUsers,
        postCreateNewUser: postCreateNewUser,
        createPublicUser: createPublicUser,
        putSaveTradeUrl: putSaveTradeUrl,
        putTransferToStatic: putTransferToStatic,
        putTransferToActive: putTransferToActive,
        steamSuccessfulAuth: steamSuccessfulAuth,
        copyUser: copyUser,
        logout: logout
    }
}());

module.exports = userController;
