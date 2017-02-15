"use strict";
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// set up mongoose model
var statsSchema = new Schema({
    dropsGiven: Number
}, { collection: 'info' });

module.exports = mongoose.model('Stats', statsSchema);
