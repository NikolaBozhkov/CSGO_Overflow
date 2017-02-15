"use strict";
let config = require('../config/config'),
    io = require('../config/socket').io,
    auth = require('../config/auth'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    userController = require('./user.controller'),
    itemsController = require('./items.controller'),
    gameController = require('./game.controller');

let messages = [];

module.exports = {
    getToken: function(socket) {
        // Get token out of cookie
        var cookies = socket.handshake.headers.cookie;
        var temp = cookies ? cookies.split('token=')[1] : null;
        var token = temp ? temp.split('; ')[0] : null;

        return token;
    },

    onNewMessage: function(data, socket) {
        // DO not allow empty messages
        if (!data.text.trim()) {
            return;
        }

        jwt.verify(module.exports.getToken(socket), config.secret, (err, userJwt) => {
            if (!err) {
                userController.loadAllUsers((err, users, usersIndex) => {
                    if (err) return console.log('could not get users');

                    let user = usersIndex[userJwt.id];
                    if (!user) return;
                    if (user.clearance === 'muted') return; // if muted do nothing

                    data.source = user.clearance;
                    data.id = user.id;

                    if (data.text[0] === '!') {
                        let components = data.text.split('/');
                        let command = components[0].substring(1);

                        if (user.clearance === 'admin') {
                            switch (command) {
                                case 'bot':
                                    data.source = 'bot';
                                    data.text = components[1];
                                    break;
                                case 'updateItems':
                                    itemsController.updateItems();
                                    return;
                                case 'updateDropsGiven':
                                    gameController.updateDropsGiven(false);
                                    return;
                                case 'updateUsers':
                                    userController.loadAllUsers((a, b, c) => {}, true);
                                    return;
                                case 'add':
                                    userController.loadAllUsers((err, users, usersIndex) => {
                                        if (err) return; // TODO: fix error handling

                                        let user = usersIndex[components[1]];
                                        let currency = parseInt(components[2]);
                                        if (user && !isNaN(currency)) {
                                            user.update({ staticCurrency: user.staticCurrency + currency }, (err) => {
                                                if (err) return;
                                                user.staticCurrency += currency;
                                            });
                                        }
                                    });
                                    return;
                                default:
                                    break;
                            }

                            // TODO: User command give and help
                            // switch (command) {
                            //     case 'give':
                            //         data.source = 'bot';
                            //         data.text = components[1];
                            //         break;
                            //     default:
                            //         break;
                            // }
                        }
                    }

                    messages.push(data);

                    if (messages.length > config.maxMsgCount) {
                        messages.shift();
                    }

                    io.emit('chatUpdate', data);
                });

            }
        });
    },

    getAllMessages: function() {
        return messages;
    }
}
