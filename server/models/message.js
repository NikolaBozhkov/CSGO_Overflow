"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// set up mongoose model
var messageSchema = new Schema({
    username: String,
    avatarUrl: String,
    time: String,
    text: String
});

module.exports = mongoose.model('Message', messageSchema);
