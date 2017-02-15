"use strict";
let io = require('./socket').io,
    userController = require('../controllers/user.controller'),
    messageController = require('../controllers/message.controller'),
    dropperController = require('../controllers/dropper.controller');

let onlineUsers = 0;

module.exports = function() {
    io.on('connection', function (socket) {
        onlineUsers += 1;
        io.sockets.emit('userConnected');
        socket.emit('onlineUsers', onlineUsers);
        userController.onUserConnected(socket);

        socket.emit('allMessages', messageController.getAllMessages());
        socket.on('newMessage', (data) => { messageController.onNewMessage(data, socket) });

        socket.on('adLoaded', dropperController.onAdLoaded);

        socket.on('disconnect', () => {
            onlineUsers -= 1;
            io.sockets.emit('userDisconnected');
            userController.onUserDisconnected(socket);
        });
    });
}
